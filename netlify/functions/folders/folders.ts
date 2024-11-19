import { Handler } from "@netlify/functions";
import { dynamoDb } from "../awsConfig";
import { v4 as uuidv4 } from "uuid";
import { Folder } from "../types";
import AWS from "aws-sdk";

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "production"
        ? "actimate-takehome.netlify.app"
        : "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
      }),
    };
  }

  try {
    // if (process.env.NODE_ENV === "development") {
    console.log("Incoming Request:", {
      httpMethod: event.httpMethod,
      path: event.path,
      body: event.body,
      queryStringParameters: event.queryStringParameters,
    });
    // }
    const { httpMethod, path, body, queryStringParameters } = event;
    const foldersTable = "actimate-takehome"; // Ensure this matches your DynamoDB table

    // Normalize path by removing trailing slashes
    const normalizedPath = path.replace(/\/+$/, "");

    // === GET /folders ===
    if (normalizedPath === "/folders" && httpMethod === "GET") {
      const { page, sort, lastKey } = queryStringParameters || {};
      const limit = 20;
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: foldersTable,
        Limit: parseInt(limit.toString(), 10),
        ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
      };
      const data = await dynamoDb.scan(params).promise();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          folders: data.Items,
          lastKey: data.LastEvaluatedKey,
        }),
      };
    }

    // === POST /folders ===
    if (normalizedPath === "/folders" && httpMethod === "POST") {
      const { name } = JSON.parse(body!);
      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Folder name is required." }),
        };
      }

      const newFolder: Folder = {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await dynamoDb
        .put({ TableName: foldersTable, Item: newFolder })
        .promise();
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newFolder),
      };
    }

    // === PUT /folders/:id ===
    const putFolderMatch = normalizedPath.match(/^\/folders\/([^/]+)$/);
    if (putFolderMatch && httpMethod === "PUT") {
      const folderId = putFolderMatch[1];
      const { name } = JSON.parse(body!);
      if (!name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Folder name is required." }),
        };
      }
      const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: foldersTable,
        Key: { id: folderId },
        UpdateExpression: "set #name = :name, updatedAt = :updatedAt",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: {
          ":name": name,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
      };
      const data = await dynamoDb.update(params).promise();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.Attributes),
      };
    }

    // === DELETE /folders/:id ===
    const deleteFolderMatch = normalizedPath.match(/^\/folders\/([^/]+)$/);
    if (deleteFolderMatch && httpMethod === "DELETE") {
      const folderId = deleteFolderMatch[1];
      const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: foldersTable,
        Key: { id: folderId },
      };
      await dynamoDb.delete(params).promise();
      return {
        statusCode: 204,
        headers,
        body: JSON.stringify({
          success: true,
        }),
      };
    }

    // If none of the above conditions match, return 405
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Unhandled Request" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
