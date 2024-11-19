import { Handler } from "@netlify/functions";
import { dynamoDb, S3 } from "../awsConfig";
import { v4 as uuidv4 } from "uuid";
import { Image } from "../types";

export const handler: Handler = async (event) => {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "production"
        ? "https://actimate-takehome.netlify.app"
        : "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  try {
    const { httpMethod, path, body, queryStringParameters } = event;
    const imagesTable = "Images"; // Ensure this matches your DynamoDB table

    // Normalize path by removing trailing slashes and ensuring it starts with '/'
    const normalizedPath = `/${path.replace(/^\/+|\/+$/g, "")}`;

    // Log the incoming request for debugging purposes
    console.log("Incoming Request:", {
      httpMethod,
      path: normalizedPath,
      body,
      queryStringParameters,
    });

    // Route Matching Patterns
    // 1. GET /folders/:folderId/images/upload
    const uploadUrlMatch = normalizedPath.match(/^\/folders\/([^/]+)\/images\/upload$/);
    // 2. GET /folders/:folderId/images
    const listImagesMatch = normalizedPath.match(/^\/folders\/([^/]+)\/images$/);
    // 3. POST /folders/:folderId/images
    const addImageMatch = normalizedPath.match(/^\/folders\/([^/]+)\/images$/);
    // 4. DELETE /folders/:folderId/images/:imageId
    const deleteImageMatch = normalizedPath.match(/^\/folders\/([^/]+)\/images\/([^/]+)$/);

    // 1. Handle GET /folders/:folderId/images/upload
    if (uploadUrlMatch && httpMethod === "GET") {
      const folderId = uploadUrlMatch[1];
      const { filename } = queryStringParameters || {};

      if (!filename) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Filename is required." }),
        };
      }

      const key = `images/${uuidv4()}-${filename}`;

      // Dynamically determine ContentType based on file extension
      const extension = filename.split(".").pop()?.toLowerCase();
      let contentType = "application/octet-stream"; // Default binary type

      switch (extension) {
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        case "png":
          contentType = "image/png";
          break;
        case "gif":
          contentType = "image/gif";
          break;
        case "bmp":
          contentType = "image/bmp";
          break;
        case "webp":
          contentType = "image/webp";
          break;
        // Add more cases as needed
      }

      const url = S3.getSignedUrl("putObject", {
        Bucket: process.env.VITE_S3_BUCKET_NAME!,
        Key: key,
        Expires: 60, // URL valid for 60 seconds
        ContentType: contentType, // Adjust based on file extension
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ url, key }),
      };
    }

    // 2. Handle GET /folders/:folderId/images
    if (listImagesMatch && httpMethod === "GET") {
      const folderId = listImagesMatch[1];
      const { page, sort, lastKey } = queryStringParameters || {};
      const limit = 20;

      // Optional: Implement sorting based on 'sort' parameter
      // For simplicity, assuming sort can be 'name' or 'date'
      let sortField = "createdAt";
      let sortDirection = "DESC";

      if (sort) {
        const [field, direction] = sort.split("_");
        if (["name", "createdAt", "updatedAt"].includes(field)) {
          sortField = field;
        }
        if (["asc", "desc"].includes(direction?.toLowerCase())) {
          sortDirection = direction.toUpperCase();
        }
      }

      const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: imagesTable,
        IndexName: "folderId-index", // Ensure this GSI is created in DynamoDB
        KeyConditionExpression: "folderId = :folderId",
        ExpressionAttributeValues: { ":folderId": folderId },
        Limit: parseInt(limit.toString(), 10),
        ScanIndexForward: sortDirection === "ASC", // true for ascending
      };

      if (lastKey) {
        try {
          params.ExclusiveStartKey = JSON.parse(lastKey);
        } catch (err) {
          console.error("Invalid LastEvaluatedKey:", err);
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: "Invalid lastKey parameter." }),
          };
        }
      }

      const data = await dynamoDb.query(params).promise();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          images: data.Items,
          lastKey: data.LastEvaluatedKey,
        }),
      };
    }

    // 3. Handle POST /folders/:folderId/images
    if (addImageMatch && httpMethod === "POST") {
      const folderId = addImageMatch[1];

      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Request body is required." }),
        };
      }

      let parsedBody: any;
      try {
        parsedBody = JSON.parse(body);
      } catch (err) {
        console.error("Invalid JSON in request body:", err);
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Invalid JSON format." }),
        };
      }

      const { key, name } = parsedBody;

      if (!key || !name) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Both 'key' and 'name' are required." }),
        };
      }

      const newImage: Image = {
        id: uuidv4(),
        folderId,
        key,
        name,
        url: `https://${process.env.VITE_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await dynamoDb.put({ TableName: imagesTable, Item: newImage }).promise();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newImage),
      };
    }

    // 4. Handle DELETE /folders/:folderId/images/:imageId
    if (deleteImageMatch && httpMethod === "DELETE") {
      const folderId = deleteImageMatch[1];
      const imageId = deleteImageMatch[2];

      if (!imageId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Image ID is required." }),
        };
      }

      // Optionally, fetch the image to get the 'key' for S3 deletion
      const getParams: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: imagesTable,
        Key: { id: imageId },
      };

      const imageData = await dynamoDb.get(getParams).promise();

      if (!imageData.Item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Image not found." }),
        };
      }

      const { key } = imageData.Item as Image;

      // Delete the image from DynamoDB
      const deleteParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: imagesTable,
        Key: { id: imageId },
      };

      await dynamoDb.delete(deleteParams).promise();

      // Optionally, delete the image from S3
      const s3Params = {
        Bucket: process.env.VITE_S3_BUCKET_NAME!,
        Key: key,
      };

      await S3.deleteObject(s3Params).promise();

      return {
        statusCode: 204,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    // If none of the above conditions match, return 405
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Unhandled Request" }),
    };
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
