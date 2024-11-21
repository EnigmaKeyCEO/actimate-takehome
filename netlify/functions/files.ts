import { Handler } from "@netlify/functions";
import { S3, dynamoDb } from "./awsConfig";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
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

  const params = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    IndexName: "folderId-index",
    // KeyConditionExpression: "folderId = :folderId",
    // ExpressionAttributeValues: {
    //   ":folderId": { S: folderId || "root" },
    // },
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
    // Ensure the body is base64-decoded if `isBase64Encoded` is true
    const decodedBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    console.debug("decodedBody", decodedBody);
    // Parse the multipart body manually
    const boundary = event.headers["content-type"].split("boundary=")[1];
    const parts = decodedBody.split(`--${boundary}`);

    let base64Image = "";
    for (const part of parts) {
      if (
        part.includes("Content-Disposition") &&
        part.includes('name="file"')
      ) {
        // Extract the base64 content
        base64Image = part.split("\r\n\r\n")[1]?.trim();
        break;
      }
    }

    if (!base64Image) {
      throw new Error("Base64 image string not found in the request body.");
    }

    // Convert the base64 string into a Buffer for S3 upload
    const fileBuffer = Buffer.from(base64Image, "base64");

    // S3 Upload Parameters
    const s3Params = {
      Bucket: process.env.VITE_S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}-image.webp`, // Example key
      Body: fileBuffer,
      ContentType: "image/webp", // Adjust based on your use case
      ACL: "public-read", // Optional: Makes the file publicly accessible
    } as PutObjectCommandInput;

    // Upload to S3
    const resultHolder = {
      uploadResult: null,
      s3Error: null,
    } as {
      uploadResult: PutObjectCommandOutput | null;
      s3Error: any;
    };

    try {
      resultHolder.uploadResult = await S3.send(
        new PutObjectCommand(s3Params)
      );
    } catch (s3Error: any) {
      console.error("Error uploading file to S3:", s3Error);
      resultHolder.s3Error = s3Error;
    }

    if (resultHolder.s3Error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: "Error uploading file to S3",
          details: resultHolder.s3Error,
        }),
      };
    }

    const fields = event.fields;
    const file = event.files[0];

    // Create file record in DynamoDB
    const fileItem: FileItem = {
      id: uuidv4(),
      folderId: fields.folderId[0] || "root",
      key: s3Params.Key!,
      url: `https://${process.env.VITE_S3_BUCKET_NAME}.s3.${
        process.env.VITE_AWS_REGION
      }.amazonaws.com/${s3Params.Key!}`,
      name: file.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const putItemParams = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Item: {
        id: { S: fileItem.id },
        folderId: { S: fileItem.folderId },
        key: { S: fileItem.key },
        url: { S: fileItem.url },
        name: { S: fileItem.name },
        createdAt: { S: fileItem.createdAt },
        updatedAt: { S: fileItem.updatedAt },
      },
    };

    const putItemCommand = new PutItemCommand(putItemParams);
    await dynamoDb.send(putItemCommand);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(fileItem),
    };
  } catch (error) {
    console.error(
      "Error uploading file to S3:",
      JSON.stringify(error, null, 2)
    );
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
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
  const { id } = JSON.parse(event.body);

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

  // Delete file from S3
  const deleteParams = {
    Bucket: process.env.VITE_S3_BUCKET_NAME!,
    Key: existingFile.key,
  };

  const deleteCommand = new DeleteObjectCommand(deleteParams);
  await S3.send(deleteCommand);

  // Remove record from DynamoDB
  const deleteItemParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: {
      id: { S: id },
    },
  };

  const deleteItemCommand = new DeleteItemCommand(deleteItemParams);
  await dynamoDb.send(deleteItemCommand);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "File deleted successfully" }),
  };
};
