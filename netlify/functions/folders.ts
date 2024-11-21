import { Handler } from "@netlify/functions";
import { dynamoDb } from "./awsConfig";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Folder } from "../../src/types/Folder";
import { v4 as uuidv4 } from "uuid";

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
  const lastKey = event.queryStringParameters?.lastKey;

  const params = {
    TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
    IndexName: "parentId-index", // Assuming you have a GSI for parentId
    KeyConditionExpression: "parentId = :parentId",
    ExpressionAttributeValues: {
      ":parentId": { S: String(parentId) }, // Ensure string type
    },
    ScanIndexForward: true,
    Limit: 20,
    ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
  };

  const command = new QueryCommand(params);
  const result = await dynamoDb.send(command);
  const folders: Folder[] = result.Items
    ? result.Items.map((item) => unmarshall(item) as Folder)
    : [];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      folders,
      lastKey: result.LastEvaluatedKey
        ? JSON.stringify(result.LastEvaluatedKey)
        : null,
    }),
  };
};

// Handler for POST requests to create a new folder
const handlePost = async (event: any, headers: any) => {
  console.log(
    "POST request received for folders:",
    JSON.stringify(event, null, 2)
  );
  try {
    const data = JSON.parse(event.body);

    const { name, parentId } = data;

    if (!name) {
      throw new Error("Folder name is required");
    }

    const folderId = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
      Item: {
        id: { S: folderId },
        name: { S: String(name) }, // Ensure string type
        parentId: { S: String(parentId || "root") }, // Default to "root" if not provided
        createdAt: { S: timestamp },
        updatedAt: { S: timestamp },
      },
    };

    const command = new PutItemCommand(params);
    await dynamoDb.send(command);

    const folder: Folder = {
      id: folderId,
      name: name,
      parentId: parentId || "root",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: "Folder created successfully",
        folder,
      }),
    };
  } catch (error: any) {
    console.error("Error in handlePost for folders:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

// Handler for PUT requests to update a folder
const handlePut = async (event: any, headers: any) => {
  console.log(
    "PUT request received for folders:",
    JSON.stringify(event, null, 2)
  );
  try {
    const { id, updateData } = JSON.parse(event.body);

    if (!id) {
      throw new Error("Folder ID is required");
    }

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

    // Build update expression
    const updateExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (updateData.name) {
      updateExpression.push("#name = :name");
      expressionAttributeValues[":name"] = { S: String(updateData.name) };
      expressionAttributeNames["#name"] = "name";
    }

    if (updateData.parentId) {
      updateExpression.push("parentId = :parentId");
      expressionAttributeValues[":parentId"] = {
        S: String(updateData.parentId),
      };
    }

    // Always update the updatedAt timestamp
    updateExpression.push("updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = { S: new Date().toISOString() };

    const updateParams = {
      TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
      Key: {
        id: { S: id },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames:
        Object.keys(expressionAttributeNames).length > 0
          ? expressionAttributeNames
          : undefined,
      ReturnValues: "ALL_NEW",
    } as UpdateItemCommandInput;

    const updateCommand = new UpdateItemCommand(updateParams);
    const updateResult = await dynamoDb.send(updateCommand);
    const updatedFolder = unmarshall(updateResult.Attributes!) as Folder;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Folder updated successfully",
        folder: updatedFolder,
      }),
    };
  } catch (error: any) {
    console.error("Error in handlePut for folders:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

// Handler for DELETE requests to delete a folder
const handleDelete = async (event: any, headers: any) => {
  console.log(
    "DELETE request received for folders:",
    JSON.stringify(event, null, 2)
  );
  try {
    const { id } = JSON.parse(event.body);

    if (!id) {
      throw new Error("Folder ID is required");
    }

    const deleteParams = {
      TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!,
      Key: { id: { S: id } },
    };

    const deleteCommand = new DeleteItemCommand(deleteParams);
    await dynamoDb.send(deleteCommand);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Folder deleted successfully" }),
    };
  } catch (error: any) {
    console.error("Error in handleDelete for folders:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
