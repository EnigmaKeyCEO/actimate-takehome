import { Handler } from "@netlify/functions";
import { S3, dynamoDb } from "./awsConfig"; // Import S3 and DynamoDB configurations
import { v4 as uuidv4 } from "uuid";

interface FileItem {
  id: string;
  folderId: string;
  key: string;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

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
    const apiBaseUrl = process.env.API_BASE_URL || "https://your-api-base-url.com";

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

  const params = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    IndexName: "folderId-index",
    KeyConditionExpression: "folderId = :folderId",
    ExpressionAttributeValues: {
      ":folderId": folderId || "root",
    },
    ScanIndexForward: true, // true for ascending, false for descending
  };

  const result = await dynamoDb.query(params).promise();
  const files: FileItem[] = result.Items as FileItem[];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(files),
  };
};

// Handler for POST requests to upload a new file
const handlePost = async (event: any, headers: any) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Request body is missing." }),
    };
  }

  const body = JSON.parse(event.body);
  const file = body.file;

  if (!file) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "File data is required." }),
    };
  }

  const { uri, name, type, folderId } = file;

  if (!uri || !name || !type || !folderId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "File uri, name, type, and folderId are required." }),
    };
  }

  const id = uuidv4();
  const key = `uploads/${id}-${name}`;
  const fileUrl = `https://${process.env.VITE_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  const timestamp = new Date().toISOString();

  const uploadParams = {
    Bucket: process.env.VITE_S3_BUCKET_NAME!,
    Key: key,
    Body: Buffer.from(uri, 'base64'),
    ContentType: type,
  };

  await S3.upload(uploadParams).promise();

  const fileItem: FileItem = {
    id,
    folderId,
    key,
    url: fileUrl,
    name,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const dbParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME ?? "Files",
    Item: fileItem,
  };

  await dynamoDb.put(dbParams).promise();

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(fileItem),
  };
};

// Handler for PUT requests to update a file's metadata
const handlePut = async (event: any, headers: any) => {
  const pathSegments = event.path.split("/");
  const fileId = pathSegments[pathSegments.length - 1];

  if (!fileId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "File ID is required in the URL." }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Request body is missing." }),
    };
  }

  const body = JSON.parse(event.body);
  const { name, folderId } = body;

  if (!name && !folderId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "At least one of name or folderId must be provided." }),
    };
  }

  const updateExpressions: string[] = [];
  const expressionAttributeValues: any = {};

  if (name) {
    updateExpressions.push("name = :name");
    expressionAttributeValues[":name"] = name;
  }

  if (folderId) {
    updateExpressions.push("folderId = :folderId");
    expressionAttributeValues[":folderId"] = folderId;
  }

  updateExpressions.push("updatedAt = :updatedAt");
  expressionAttributeValues[":updatedAt"] = new Date().toISOString();

  const params = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: { id: fileId },
    UpdateExpression: "set " + updateExpressions.join(", "),
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  const updatedFile: FileItem = result.Attributes as FileItem;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(updatedFile),
  };
};

// Handler for DELETE requests to remove a file
const handleDelete = async (event: any, headers: any) => {
  const pathSegments = event.path.split("/");
  const fileId = pathSegments[pathSegments.length - 1];

  if (!fileId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "File ID is required in the URL." }),
    };
  }

  // Retrieve the file item to get the S3 key
  const getParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: { id: fileId },
  };

  const getResult = await dynamoDb.get(getParams).promise();
  const fileItem: FileItem | undefined = getResult.Item as FileItem | undefined;

  if (!fileItem) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "File not found." }),
    };
  }

  // Delete from S3
  const deleteS3Params = {
    Bucket: process.env.VITE_S3_BUCKET_NAME!,
    Key: fileItem.key,
  };

  await S3.deleteObject(deleteS3Params).promise();

  // Delete from DynamoDB
  const deleteDbParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: { id: fileId },
  };

  await dynamoDb.delete(deleteDbParams).promise();

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: "File deleted successfully." }),
  };
};
