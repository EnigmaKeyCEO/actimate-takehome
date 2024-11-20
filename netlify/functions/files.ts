import { Handler } from "@netlify/functions";
import { S3, dynamoDb } from "./awsConfig";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import { DeleteItemCommand, GetItemCommand, PutItemCommand, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
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
    KeyConditionExpression: "folderId = :folderId",
    ExpressionAttributeValues: {
      ":folderId": { S: folderId || "root" },
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
      lastKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
    }),
  };
};

// Handler for POST requests to upload a new file
const handlePost = async (event: any, headers: any) => {
  const formData = JSON.parse(event.body);
  const { file, folderId } = formData;

  const fileId = uuidv4();
  const key = `${folderId}/${file.name}`;

  // Upload file to S3
  const putParams = {
    Bucket: process.env.VITE_S3_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(file.content, "base64"),
    ContentType: file.type,
  };

  const putCommand = new PutObjectCommand(putParams);
  await S3.send(putCommand);

  // Create file record in DynamoDB
  const fileItem: FileItem = {
    id: fileId,
    folderId: folderId || "root",
    key,
    url: `https://${process.env.VITE_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
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
        S: `https://${process.env.VITE_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`,
      },
      ":updatedAt": { S: updatedAt },
    },
    ReturnValues: "ALL_NEW",
  } as UpdateItemCommandInput;

  const updateCommand = new UpdateItemCommand(updateParams);
  const updateResult = await dynamoDb.send(updateCommand);

  const updatedFile: FileItem = unmarshall(updateResult.Attributes!) as FileItem;

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
