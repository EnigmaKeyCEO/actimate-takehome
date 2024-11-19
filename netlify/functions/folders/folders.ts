import { Handler } from "@netlify/functions";
import { dynamoDb } from "../awsConfig";
import { v4 as uuidv4 } from "uuid";
import { Folder } from "../types";

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
      body: "",
    };
  }

  try {
    const { httpMethod, path, body, queryStringParameters } = event;
    const foldersTable = "Folders"; // Ensure this matches your DynamoDB table

    if (path === "/folders" && httpMethod === "GET") {
      const { page, sort, lastKey } = queryStringParameters || {};
      const limit = 20;
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: foldersTable,
        Limit: parseInt(limit.toString(), 10),
        ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined,
        // Implement sorting logic if using a Scan or preferably using Query with sort keys
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

    if (path === "/folders" && httpMethod === "POST") {
      const { name } = JSON.parse(body!);
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

    if (path.startsWith("/folders/") && httpMethod === "PUT") {
      const folderId = path.split("/")[2];
      const { name } = JSON.parse(body!);
      const params = {
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

    if (path.startsWith("/folders/") && httpMethod === "DELETE") {
      const folderId = path.split("/")[2];
      const params = {
        TableName: foldersTable,
        Key: { id: folderId },
      };
      await dynamoDb.delete(params).promise();
      return {
        statusCode: 204,
        headers,
        body: "",
      };
    }

    return { statusCode: 405, headers, body: "Method Not Supported" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers, body: "Internal Server Error" };
  }
};
