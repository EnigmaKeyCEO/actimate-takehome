import { Handler } from "@netlify/functions";
import { S3, dynamoDb } from "./awsConfig";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { FileItem } from "../../src/types/File";
import { v4 as uuidv4 } from "uuid";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await handleGet(event, headers);
      case "POST":
        return await handlePost(event, headers);
      case "PUT":
        return await handlePut(event, headers);
      case "DELETE":
        return await handleDelete(event, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: "Method Not Allowed" }),
        };
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Handler for GET requests to list files
const handleGet = async (event: any, headers: any) => {
  const folderId = event.queryStringParameters?.folderId;
  const lastKey = event.queryStringParameters?.lastKey;

  if (!folderId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "folderId is required" }),
    };
  }

  const params = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    IndexName: "folderId-index",
    KeyConditionExpression: "folderId = :folderId",
    ExpressionAttributeValues: {
      ":folderId": String(folderId),
    },
    ScanIndexForward: true,
    Limit: 20,
    ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
  };

  const command = new QueryCommand(params);
  const result = await dynamoDb.send(command);
  const files: FileItem[] = result.Items
    ? result.Items.map((item) => unmarshall(item) as FileItem)
    : [];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      files,
      lastKey: result.LastEvaluatedKey
        ? JSON.stringify(result.LastEvaluatedKey)
        : null,
    }),
  };
};

// Handler for POST requests to generate a pre-signed URL for file upload
const handlePost = async (event: any, headers: any) => {
  console.log("POST request received:", JSON.stringify(event, null, 2));
  try {
    let parsedBody;
    if (event.isBase64Encoded) {
      const decodedBody = Buffer.from(event.body, 'base64').toString();
      parsedBody = JSON.parse(decodedBody);
    } else {
      parsedBody = JSON.parse(event.body); 
    }
    const { folderId, fileName, contentType } = parsedBody;

    if (!folderId || !fileName || !contentType) {
      throw new Error("folderId, fileName, and contentType are required.");
    }

    // Generate a unique file ID and S3 key
    const fileId = uuidv4();
    const s3Key = `uploads/${Date.now()}-${fileId}-${fileName}`;

    // Create S3 PutObjectCommand
    const putCommand = new PutObjectCommand({
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
      Key: s3Key,
      ContentType: contentType,
    });

    // Generate pre-signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(S3, putCommand, { expiresIn: 3600 });

    // Store file metadata in DynamoDB
    const dynamoParams = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Item: {
        id: { S: fileId },
        folderId: { S: String(folderId) },
        key: { S: s3Key },
        name: { S: fileName },
        url: {
          S: `https://${process.env.VITE_AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`,
        },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    };

    const putDynamoCommand = new PutItemCommand(dynamoParams);
    await dynamoDb.send(putDynamoCommand);
    console.log("File metadata stored in DynamoDB:", dynamoParams.Item);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Pre-signed URL generated successfully",
        fileId,
        signedUrl,
      }),
    };
  } catch (error: any) {
    console.error("Error in handlePost:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

// Handler for PUT requests to update a file
const handlePut = async (event: any, headers: any) => {
  const { id, updateData } = JSON.parse(event.body);

  // Fetch existing file record
  const getParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: {
      id: { S: id },
    },
  };

  const getCommand = new GetItemCommand(getParams);
  const getResult = await dynamoDb.send(getCommand);

  if (!getResult.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "File not found" }),
    };
  }

  const existingFile: FileItem = unmarshall(getResult.Item) as FileItem;

  // Update S3 key if folderId or name changes
  let newKey = existingFile.key;
  if (updateData.folderId || updateData.name) {
    const newFolderId = updateData.folderId || existingFile.folderId;
    const newName = updateData.name || existingFile.name;
    newKey = `${newFolderId}/${newName}`;

    const copyParams = {
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
      CopySource: `${process.env.VITE_AWS_BUCKET_NAME}/${existingFile.key}`,
      Key: newKey,
    };

    const copyCommand = new CopyObjectCommand(copyParams);
    await S3.send(copyCommand);

    const deleteParams = {
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
      Key: existingFile.key,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await S3.send(deleteCommand);
  }

  // Update DynamoDB record
  const updatedAt = new Date().toISOString();
  const updateParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: {
      id: { S: id },
    },
    UpdateExpression:
      "set folderId = :folderId, #name = :name, key = :key, url = :url, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":folderId": { S: updateData.folderId || existingFile.folderId },
      ":name": { S: updateData.name || existingFile.name },
      ":key": { S: newKey },
      ":url": {
        S: `https://${process.env.VITE_AWS_BUCKET_NAME}.s3.${process.env.VITE_AWS_REGION}.amazonaws.com/${newKey}`,
      },
      ":updatedAt": { S: updatedAt },
    },
    ReturnValues: "ALL_NEW",
  } as UpdateItemCommandInput;

  const updateCommand = new UpdateItemCommand(updateParams);
  const updateResult = await dynamoDb.send(updateCommand);

  const updatedFile: FileItem = unmarshall(
    updateResult.Attributes!
  ) as FileItem;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(updatedFile),
  };
};

// Handler for DELETE requests to remove a file
const handleDelete = async (event: any, headers: any) => {
  console.log(
    "DELETE request received for files:",
    JSON.stringify(event, null, 2)
  );
  try {
    const { fileId } = JSON.parse(event.body);

    if (!fileId) {
      throw new Error("fileId is required for deletion.");
    }

    // DynamoDB DeleteItemCommand
    const params = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Key: {
        id: { S: String(fileId) }, // Ensure string type
      },
    };
    console.debug(
      "DynamoDB DeleteItem params:",
      JSON.stringify(params, null, 2)
    );

    const command = new DeleteItemCommand(params);
    const result = await dynamoDb.send(command);
    console.log("File deleted from DynamoDB:", result);

    // Delete the file from S3 as well
    const fileKey = await getFileKeyFromDynamoDB(fileId);
    if (fileKey) {
      const deleteS3Params = {
        Bucket: process.env.VITE_AWS_BUCKET_NAME!,
        Key: fileKey,
      };
      const deleteS3Command = new DeleteObjectCommand(deleteS3Params);
      await S3.send(deleteS3Command);
      console.log("File deleted from S3:", fileKey);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "File deleted successfully" }),
    };
  } catch (error: any) {
    console.error("Error in handleDelete:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

const getFileKeyFromDynamoDB = async (
  fileId: string
): Promise<string | null> => {
  const getParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: {
      id: { S: fileId },
    },
  };

  const getCommand = new GetItemCommand(getParams);
  const getResult = await dynamoDb.send(getCommand);

  if (getResult.Item) {
    const file: FileItem = unmarshall(getResult.Item) as FileItem;
    return file.key;
  }

  return null;
};
