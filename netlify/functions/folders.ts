import { Handler } from "@netlify/functions";
import { dynamoDb } from "./awsConfig";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { CreateFolderInput, Folder } from "../../src/types/Folder";
import { v4 as uuidv4 } from "uuid";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    // Handle CORS preflight
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  const tableName = process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME!;

  // Helper function to get folder by ID
  const getFolderById = async (id: string): Promise<Folder | null> => {
    const params = {
      TableName: tableName,
      Key: {
        id: { S: id },
      },
    };

    try {
      const command = new GetItemCommand(params);
      const result = await dynamoDb.send(command);
      if (!result.Item) {
        return null;
      }
      return unmarshall(result.Item) as Folder;
    } catch (error) {
      console.error("Error fetching folder by ID:", error);
      throw new Error("Error fetching folder by ID");
    }
  };

  // Helper function to fetch all folders (for building breadcrumb)
  const queryFolders = async (parentId: string, sortField: string, sortDirection: string) => {
    const params = {
      TableName: tableName,
      KeyConditionExpression: "parentId = :parentId",
      ExpressionAttributeValues: {
        ":parentId": { S: parentId },
      },
      ScanIndexForward: sortDirection === "asc", // Sort ascending or descending
      limit: 20,
    };

    try {
      const command = new QueryCommand(params);
      const result = await dynamoDb.send(command);
      const folders = result.Items ? result.Items.map((item) => unmarshall(item) as Folder) : [];
      return folders;
    } catch (error) {
      console.error("Error querying folders:", error);
      throw new Error("Error querying folders");
    }
  };

  // Main handler logic
  switch (event.httpMethod) {
    case "GET":
      if (event.path && event.path.startsWith("/folders/")) {
        const folderId = event.path.split("/").pop() || "root";
        try {
          const folder = await getFolderById(folderId);
          if (!folder) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: "Folder not found" }),
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(folder),
          };
        } catch (error: any) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: error.message }),
          };
        }
      } else {
        // Handle GET requests without ID (e.g., list folders)
        const folderId = event.queryStringParameters?.folderId || "root";
        const sortField = event.queryStringParameters?.sortField || "name";
        const sortDirection = event.queryStringParameters?.sortDirection || "asc";
        const page = parseInt(event.queryStringParameters?.page || "1", 10);
        const limit = parseInt(event.queryStringParameters?.limit || "20", 10);

        // Implement pagination if needed
        try {
          const folders = await queryFolders(folderId, sortField, sortDirection);
          const paginatedFolders = folders.slice(0, limit); // Simple pagination
          const lastKey = folders.length > limit ? folders[limit - 1].id : undefined;

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              folders: paginatedFolders,
              lastKey,
            }),
          };
        } catch (error: any) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: error.message }),
          };
        }
      }

    case "POST":
      // Handle creating a new folder
      try {
        const data: CreateFolderInput = JSON.parse(event.body!);
        const newFolder: Folder = {
          id: uuidv4(),
          name: data.name,
          parentId: data.parentId || "root",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          // Add other necessary fields
        };

        const params = {
          TableName: tableName,
          Item: {
            id: { S: newFolder.id },
            name: { S: newFolder.name },
            parentId: { S: newFolder.parentId },
            createdAt: { S: newFolder.createdAt },
            updatedAt: { S: newFolder.updatedAt },
            // Add other necessary fields
          },
        } as PutItemCommandInput;

        const command = new PutItemCommand(params);
        await dynamoDb.send(command);

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newFolder),
        };
      } catch (error: any) {
        console.error("Error creating folder:", error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ message: "Error creating folder" }),
        };
      }

    case "DELETE":
      // Handle deleting a folder
      if (event.path && event.path.startsWith("/folders/")) {
        const folderId = event.path.split("/").pop() || "root";
        const params = {
          TableName: tableName,
          Key: {
            id: { S: folderId },
          },
        };

        try {
          const command = new DeleteItemCommand(params);
          await dynamoDb.send(command);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Folder deleted successfully" }),
          };
        } catch (error: any) {
          console.error("Error deleting folder:", error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Error deleting folder" }),
          };
        }
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Folder ID is required for deletion" }),
        };
      }

    // Add other HTTP methods (PUT, etc.) as needed

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
  }
};
