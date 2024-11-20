import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Load environment variables from a secure source
const region = process.env.VITE_AWS_REGION || "us-east-2";
const accessKeyId = process.env.VITE_AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.VITE_AWS_SECRET_ACCESS_KEY!;

// Initialize S3 Client
export const S3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Initialize DynamoDB Client
const dynamoDbClient = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Create DynamoDB Document Client
export const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);
