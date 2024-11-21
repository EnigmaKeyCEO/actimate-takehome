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
      ":folderId": { S: String(folderId) }, // Ensure folderId is a string
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

// Handler for POST requests to upload a new file
const handlePost = async (event: any, headers: any) => {
  console.log("POST request received:", JSON.stringify(event, null, 2));
  try {
    // Validate HTTP headers for content type
    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"];
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      throw new Error("Invalid content type. Expected multipart/form-data.");
    }

    // Ensure the body is base64-decoded if `isBase64Encoded` is true
    const decodedBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    console.debug("decodedBody", decodedBody);

    // Validate that decodedBody contains the required parts
    const boundaryMatch = contentType.match(/boundary=(.+)$/);
    if (!boundaryMatch) {
      throw new Error("Boundary not found in content type.");
    }
    const boundary = boundaryMatch[1];
    const parts = decodedBody.split(`--${boundary}`);

    let base64Image = "";
    for (const part of parts) {
      if (
        part.includes("Content-Disposition") &&
        part.includes('name="file"')
      ) {
        // Extract the base64 content
        const dataMatch = part.match(/\r\n\r\n([\s\S]+)\r\n$/);
        if (dataMatch && dataMatch[1]) {
          base64Image = dataMatch[1].trim();
        }
        break;
      }
    }

    if (!base64Image) {
      throw new Error("Base64 image string not found in the request body.");
    }

    // Convert the base64 string into a Buffer for S3 upload
    const fileBuffer = Buffer.from(base64Image, "base64");

    // Further validation: Check if fileBuffer is valid
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Invalid file data.");
    }

    // S3 Upload Parameters
    const s3Params = {
      Bucket: process.env.VITE_S3_BUCKET_NAME!,
      Key: `uploads/${Date.now()}-image.webp`, // Example key
      Body: fileBuffer,
      ContentType: "image/webp", // Adjust based on your use case
    };

    const uploadCommand = new PutObjectCommand(s3Params);
    const uploadResult = await S3.send(uploadCommand);
    console.log("File uploaded to S3:", uploadResult);

    // DynamoDB PutItem Parameters
    const fileId = uuidv4();
    const dynamoParams = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Item: {
        id: { S: fileId },
        folderId: { S: "root" }, // Adjust based on your context
        key: { S: s3Params.Key },
        name: { S: `Image_${fileId}` }, // Example name
        url: {
          S: `https://${process.env.VITE_S3_BUCKET_NAME}.s3.amazonaws.com/${s3Params.Key}`,
        },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    };

    const putCommand = new PutItemCommand(dynamoParams);
    const putResult = await dynamoDb.send(putCommand);
    console.log("File metadata stored in DynamoDB:", putResult);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "File uploaded successfully",
        fileId,
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
      Bucket: process.env.VITE_S3_BUCKET_NAME!,
      CopySource: `${process.env.VITE_S3_BUCKET_NAME}/${existingFile.key}`,
      Key: newKey,
    };

    const copyCommand = new CopyObjectCommand(copyParams);
    await S3.send(copyCommand);

    const deleteParams = {
      Bucket: process.env.VITE_S3_BUCKET_NAME!,
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
        S: `https://${process.env.VITE_S3_BUCKET_NAME}.s3.${process.env.VITE_AWS_REGION}.amazonaws.com/${newKey}`,
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

    // Optionally, delete the file from S3 as well
    // ...

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
