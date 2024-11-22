import { Handler } from "@netlify/functions";
import { S3, dynamoDb } from "./awsConfig";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
  __Client,
} from "@aws-sdk/client-s3";
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DBMetadata, FileItem } from "../../src/types/File";
import { v4 as uuidv4 } from "uuid";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
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
 * @returns Response object (TODO: DEFINE TYPE) with files and pagination token
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

          // Check if the file exists in DynamoDB
          const getParams = {
            TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
            Key: {
              folderId: { S: folderId.toString() },
              name: { S: fileName.toString() },
            },
          };
          const getCommand = new GetItemCommand(getParams);
          const DBResult: DBMetadata = {
            file: null,
            putCommand: null,
            lastKey: null,
          };
          try {
            const { Item = null } = await dynamoDb.send(getCommand);
            DBResult.file = Item ? (unmarshall(Item) as FileItem) : null;
          } catch (error) {
            console.warn("Error getting file from DynamoDB:", error);
          }

          if (!DBResult.file) {
            // Add file to DynamoDB if it doesn't exist
            const putParams = {
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
                "attribute_not_exists(folderId) AND attribute_not_exists(name)",
            };
            const putCommand = new PutItemCommand(putParams);
            try {
              await dynamoDb.send(putCommand);
              DBResult.file = fileItem;
            } catch (error) {
              if (error.name === "ConditionalCheckFailedException") {
                console.warn("Duplicate file entry detected:", fileItem.name);
                throw error; // handle by skipping this file; TODO: make this do something else
              } else {
                console.error(
                  "Error storing file metadata in DynamoDB:",
                  error
                );
              }
            }
          }

          fileMetadata.push({
            file: DBResult.file,
            putCommand: DBResult.putCommand,
            lastKey: null, // Not needed here
          });
        }
      }
    }

    // Prepare the signed URLs
    for (const obj of fileMetadata) {
      const signedUrl = await getSignedUrl(
        S3,
        new PutObjectCommand({
          Bucket: process.env.VITE_AWS_BUCKET_NAME!,
          Key: obj.file?.key,
        }),
        {
          expiresIn: 3600,
        }
      );
      try {
        obj.file!.url = signedUrl;
      } catch (error) {
        // fail silently, TODO: make this do something...
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
  } catch (error) {
    console.error("Error listing files from S3:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Error listing files from S3" }),
    };
  }
};

// Handler for POST requests to generate a pre-signed URL for file upload
const handlePost = async (event: any, headers: any) => {
  console.log("POST request received:", JSON.stringify(event, null, 2));
  try {
    let parsedBody: any;

    if (!event.body) {
      throw new Error("Request body is missing.");
    }

    if (event.isBase64Encoded) {
      // 'file' is the field name for the uploaded file
      parsedBody = multipart.parse(event, "file");
    } else {
      parsedBody = JSON.parse(event.body);
    }

    console.log("Parsed body:", parsedBody);

    const folderId = parsedBody.folderId;
    const fileName = parsedBody.fileName;
    const contentType = parsedBody.contentType;
    const file = parsedBody.file;

    console.debug("POST request decoded:", {
      folderId,
      fileName,
      contentType,
      file,
    });

    if (!folderId || !fileName || !contentType || !file) {
      throw new Error(
        "folderId, fileName, contentType, and file are required."
      );
    }

    // Generate a unique file ID and S3 key
    const fileId = uuidv4();
    const s3Key = `root/${Date.now()}-${fileId}-${fileName}`;

    // Create S3 PutObjectCommand
    const putCommand = new PutObjectCommand({
      Bucket: process.env.VITE_AWS_BUCKET_NAME!,
      Key: s3Key,
      ContentType: contentType,
    });

    // Generate pre-signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(S3, putCommand, { expiresIn: 3600 });

    // Store file metadata in DynamoDB
    const dynamoParams = {
      TableName: process.env.VITE_DYNAMODB_FILES_TABLE_NAME!,
      Item: {
        folderId: { S: String(folderId) },
        // key: { S: s3Key }, // TODO: add this back in, it's needed for the file upload modal, but may be causing an error, so test without it first
        name: { S: fileName },
        url: {
          S: `https://${process.env.VITE_AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`,
        },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    };

    const putDynamoCommand = new PutItemCommand(dynamoParams);
    try {
      await dynamoDb.send(putDynamoCommand);
      console.log("File metadata stored in DynamoDB:", dynamoParams.Item);
    } catch (error) {
      console.error("Error storing file metadata in DynamoDB:", error);
    }

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
