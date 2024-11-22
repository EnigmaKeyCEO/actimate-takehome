import { Handler } from "@netlify/functions";
import { S3, dynamoDb } from "./awsConfig";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommandInput,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DBMetadata, FileItem } from "../../src/types/File";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multipart from "aws-lambda-multipart-parser";

// Handler for GET requests to list files
export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return Promise.resolve({
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    });
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
        return Promise.resolve({
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: "Method Not Allowed" }),
        });
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return Promise.resolve({
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    });
  }
};

/**
 * Handles GET requests to list files with pagination.
 * Synchronizes S3 and DynamoDB to ensure data consistency.
 * @param event - Netlify event object
 * @param headers - HTTP headers for CORS
 * @returns Response object with files and pagination token
 */
const handleGet = async (event: any, headers: any) => {
  const folderId = event.queryStringParameters?.folderId;
  const lastKey = event.queryStringParameters?.lastKey;

  if (!folderId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "A parent folder is required, or send 'root' as folderId",
      }),
    };
  }

  try {
    // List objects in the S3 bucket with pagination
    const listParams = {
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
      Prefix: folderId === "root" ? "" : `${folderId}/`,
      ContinuationToken: lastKey || undefined,
      MaxKeys: 20, // Define the page size
    };
    const listCommand = new ListObjectsV2Command(listParams);
    const s3Result = await S3.send(listCommand);

    const fileMetadata: DBMetadata[] = [];

    if (s3Result.Contents) {
      for (const s3Object of s3Result.Contents) {
        const fileName = s3Object.Key?.split("/").pop();
        if (fileName) {
          const fileItem: FileItem = {
            id: uuidv4(),
            folderId,
            key: s3Object.Key!,
            name: fileName,
            url: `https://${process.env.VITE_AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Object.Key}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Query DynamoDB using the GSI to check if the file exists
          const queryParams: QueryCommandInput = {
            TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
            IndexName: "folderId-name-index",
            KeyConditionExpression: "folderId = :folderId AND #name = :name",
            ExpressionAttributeNames: {
              "#name": "name", // Mapping reserved keyword
            },
            ExpressionAttributeValues: {
              ":folderId": { S: folderId.toString() },
              ":name": { S: fileName.toString() },
            },
            Limit: 1,
          };
          const queryCommand = new QueryCommand(queryParams);
          const queryResult = await dynamoDb.send(queryCommand);

          let dbFile: FileItem | null = null;
          if (queryResult.Items && queryResult.Items.length > 0) {
            dbFile = unmarshall(queryResult.Items[0]) as FileItem;
          }

          if (!dbFile) {
            // Add file to DynamoDB if it doesn't exist
            const putParams: PutItemCommandInput = {
              TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
              Item: {
                id: { S: fileItem.id },
                folderId: { S: fileItem.folderId },
                name: { S: fileItem.name },
                url: { S: fileItem.url },
                createdAt: { S: fileItem.createdAt },
                updatedAt: { S: fileItem.updatedAt },
              },
              ConditionExpression:
                "attribute_not_exists(folderId) AND attribute_not_exists(#name)",
              ExpressionAttributeNames: {
                "#name": "name", // Mapping reserved keyword
              },
            };
            const putCommand = new PutItemCommand(putParams);
            try {
              await dynamoDb.send(putCommand);
              dbFile = fileItem;
            } catch (error: any) {
              if (error.name === "ConditionalCheckFailedException") {
                console.warn("Duplicate file entry detected:", fileItem.name);
                // Optionally, fetch the existing item again or handle duplicates as needed
              } else {
                console.error(
                  "Error storing file metadata in DynamoDB:",
                  error
                );
              }
            }
          }

          if (dbFile) {
            fileMetadata.push({
              file: dbFile,
              putCommand: null,
              lastKey: null, // Not needed here
            });
          }
        }
      }
    }

    // Prepare the signed URLs
    for (const obj of fileMetadata) {
      if (obj.file && obj.file.key) {
        try {
          const signedUrl = await getSignedUrl(
            S3,
            new PutObjectCommand({
              Bucket: process.env.VITE_AWS_BUCKET_NAME!,
              Key: obj.file.key,
            }),
            {
              expiresIn: 3600,
            }
          );
          obj.file.url = signedUrl;
        } catch (error) {
          // Handle the error appropriately
          console.warn("Error generating signed URL:", error);
        }
      } else {
        console.warn("File or Key is undefined for signed URL generation.");
      }
    }

    const files = fileMetadata.map((metadata) => metadata.file);
    const newLastKey = s3Result.NextContinuationToken || null;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        files,
        lastKey: newLastKey,
      }),
    };
  } catch (error: any) {
    console.error("Error listing files from S3 or DynamoDB:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error listing files" }),
    };
  }
};

/**
 * Handles POST requests to generate a pre-signed URL for file upload.
 * @param event - Netlify event object
 * @param headers - HTTP headers for CORS
 * @returns Response object with pre-signed URL and file details
 */
const handlePost = async (event: any, headers: any) => {
  try {
    const data = multipart.parse(event, true);
    const file = data.files ? data.files[0] || data["file"] : null;

    if (!file) {
      console.error("No file provided", data);
      throw new Error("No file provided");
    }

    const { folderId } = data.fields;

    if (!folderId) {
      throw new Error("folderId is required");
    }

    const fileId = uuidv4();
    const s3Key = `${folderId}/${file.originalFilename}`;

    const fileItem: FileItem = {
      id: fileId,
      folderId,
      key: s3Key,
      name: file.originalFilename,
      url: `https://${process.env.VITE_AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add file to DynamoDB if it doesn't exist
    const putParams: PutItemCommandInput = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Item: {
        id: { S: fileItem.id },
        folderId: { S: fileItem.folderId },
        name: { S: fileItem.name },
        url: { S: fileItem.url },
        createdAt: { S: fileItem.createdAt },
        updatedAt: { S: fileItem.updatedAt },
      },
      ConditionExpression:
        "attribute_not_exists(folderId) AND attribute_not_exists(#name)",
      ExpressionAttributeNames: {
        "#name": "name", // Mapping reserved keyword
      },
    };
    const putCommand = new PutItemCommand(putParams);
    try {
      await dynamoDb.send(putCommand);
      console.log("File metadata stored in DynamoDB:", putParams.Item);
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        console.warn("Duplicate file entry detected:", fileItem.name);
        throw new Error("File already exists");
      } else {
        console.error("Error storing file metadata in DynamoDB:", error);
        throw new Error("DynamoDB error");
      }
    }

    // Generate pre-signed URL
    const signedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: process.env.VITE_AWS_BUCKET_NAME!,
        Key: s3Key,
      }),
      { expiresIn: 3600 }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Pre-signed URL generated successfully",
        fileId,
        signedUrl,
        key: s3Key,
      }),
    };
  } catch (error: any) {
    console.error("Error in handlePost:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
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
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
      CopySource: `${process.env.VITE_AWS_BUCKET_NAME}/${existingFile.key}`,
      Key: newKey,
    };

    const copyCommand = new CopyObjectCommand(copyParams);
    await S3.send(copyCommand);

    const deleteParams = {
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
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
        S: `https://${process.env.VITE_AWS_BUCKET_NAME}.s3.${process.env.VITE_AWS_REGION}.amazonaws.com/${newKey}`,
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
  console.log(
    "DELETE request received for files:",
    JSON.stringify(event, null, 2)
  );
  try {
    const { fileId } = JSON.parse(event.body);

    if (!fileId) {
      throw new Error("fileId is required for deletion.");
    }

    // DynamoDB DeleteItemCommand
    const params = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Key: {
        id: { S: String(fileId) }, // Ensure string type
      },
    };
    console.debug(
      "DynamoDB DeleteItem params:",
      JSON.stringify(params, null, 2)
    );

    const command = new DeleteItemCommand(params);
    const result = await dynamoDb.send(command);
    console.log("File deleted from DynamoDB:", result);

    // Delete the file from S3 as well
    const fileKey = await getFileKeyFromDynamoDB(fileId);
    if (fileKey) {
      const deleteS3Params = {
        Bucket: process.env.VITE_AWS_BUCKET_NAME!,
        Key: fileKey,
      };
      const deleteS3Command = new DeleteObjectCommand(deleteS3Params);
      await S3.send(deleteS3Command);
      console.log("File deleted from S3:", fileKey);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "File deleted successfully" }),
    };
  } catch (error: any) {
    console.error("Error in handleDelete:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

const getFileKeyFromDynamoDB = async (
  fileId: string
): Promise<string | null> => {
  const getParams = {
    TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
    Key: {
      id: { S: fileId },
    },
  };

  const getCommand = new GetItemCommand(getParams);
  const getResult = await dynamoDb.send(getCommand);

  if (getResult.Item) {
    const file: FileItem = unmarshall(getResult.Item) as FileItem;
    return file.key;
  }

  return null;
};
