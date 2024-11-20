import { Handler } from "@netlify/functions";
import {
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommandInput,
  UpdateItemCommandInput,
  QueryCommand
} from "@aws-sdk/client-dynamodb";
import { dynamoDb } from "./awsConfig";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { Folder } from "../../src/types/Folder";

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

// Handler for GET requests to list folders
const handleGet = async (event: any, headers: any) => {
  const parentId = event.queryStringParameters?.parentId || "root";

  const params = {
    TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
    IndexName: "parentId-index",
    KeyConditionExpression: "parentId = :parentId",
    ExpressionAttributeValues: {
      ":parentId": { S: parentId },
    },
    ScanIndexForward: true, // true for ascending, false for descending
    Limit: 20,
  };

  const command = new QueryCommand(params);
  const result = await dynamoDb.send(command);
  const folders: Folder[] = result.Items
    ? result.Items.map((item) => unmarshall(item) as Folder)
    : [];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(folders),
  };
};

// Handler for POST requests to create a new folder
const handlePost = async (event: any, headers: any) => {
  if (!event.body || event.httpMethod !== "POST") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Invalid Request" }),
    };
  }
  try {
    console.debug("event.body", event.body);
    const { name, parentId } = JSON.parse(event.body);

    const folderId = uuidv4();
    const timestamp = new Date().toISOString();

    const folder: Folder = {
      id: folderId,
      name,
      parentId: parentId || "root",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const putParams = {
      TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
      Item: {
        id: { S: folder.id },
        name: { S: folder.name },
        parentId: { S: folder.parentId },
        createdAt: { S: folder.createdAt },
        updatedAt: { S: folder.updatedAt },
      },
    } as PutItemCommandInput;

    const putCommand = new PutItemCommand(putParams);
    await dynamoDb.send(putCommand);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(folder),
    };
  } catch (error) {
    console.error("Error creating folder:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

// Handler for PUT requests to update a folder
const handlePut = async (event: any, headers: any) => {
  const { id, name, updateData } = JSON.parse(event.body);

  // Fetch existing folder
  const getParams = {
    TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
    Key: {
      id: { S: id },
      name: { S: name },
    },
  };

  const getCommand = new GetItemCommand(getParams);
  const getResult = await dynamoDb.send(getCommand);

  if (!getResult.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Folder not found" }),
    };
  }

  const existingFolder: Folder = unmarshall(getResult.Item) as Folder;

  // Update folder details
  const updatedAt = new Date().toISOString();
  const updateParams = {
    TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
    Key: {
      id: { S: id },
    },
    UpdateExpression: "set #name = :name, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": { S: updateData.name || existingFolder.name },
      ":updatedAt": { S: updatedAt },
    },
    ReturnValues: "ALL_NEW",
  } as UpdateItemCommandInput;

  const updateCommand = new UpdateItemCommand(updateParams);
  const updateResult = await dynamoDb.send(updateCommand);

  const updatedFolder: Folder = unmarshall(updateResult.Attributes!) as Folder;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(updatedFolder),
  };
};

// Handler for DELETE requests to remove a folder
const handleDelete = async (event: any, headers: any) => {
  const { id } = JSON.parse(event.body);

  // Check if folder exists
  const getParams = {
    TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
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
      body: JSON.stringify({ message: "Folder not found" }),
    };
  }

  // Optionally: Check if folder is empty (no subfolders or files)
  // Implement if necessary

  // Delete folder from DynamoDB
  const deleteParams = {
    TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
    Key: {
      id: { S: id },
    },
  };

  const deleteCommand = new DeleteItemCommand(deleteParams);
  await dynamoDb.send(deleteCommand);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "Folder deleted successfully" }),
  };
};
