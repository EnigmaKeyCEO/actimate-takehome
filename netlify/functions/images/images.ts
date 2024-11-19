import { Handler } from '@netlify/functions';
import { dynamoDb, S3 } from '../awsConfig';
import { v4 as uuidv4 } from 'uuid';
import { Image } from '../types';

export const handler: Handler = async (event) => {
  try {
    const { httpMethod, path, body, queryStringParameters } = event;
    const imagesTable = 'Images'; // Ensure this matches your DynamoDB table

    const folderIdMatch = path.match(/\/folders\/([^/]+)\/images(\/upload)?(\/([^/]+))?/);
    if (!folderIdMatch) {
      return { statusCode: 404, body: 'Not Found' };
    }

    const folderId = folderIdMatch[1];
    const isUpload = !!folderIdMatch[2];
    const imageId = folderIdMatch[4];

    if (isUpload && httpMethod === 'GET') {
      const { filename } = queryStringParameters || {};
      const key = `images/${uuidv4()}-${filename}`;
      const url = S3.getSignedUrl('putObject', {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Expires: 60, // URL valid for 60 seconds
        ContentType: 'image/jpeg', // Adjust based on requirements
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ url, key }),
      };
    }

    if (path.endsWith('/images') && httpMethod === 'GET') {
      const { page, sort } = queryStringParameters || {};
      const limit = 20;
      const params = {
        TableName: imagesTable,
        IndexName: 'folderId-index', // Ensure this GSI is created in DynamoDB
        KeyConditionExpression: 'folderId = :folderId',
        ExpressionAttributeValues: { ':folderId': folderId },
        Limit: parseInt(limit.toString(), 10),
        // Implement pagination and sorting if necessary
      };
      const data = await dynamoDb.query(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify({ images: data.Items, lastKey: data.LastEvaluatedKey }),
      };
    }

    if (path.startsWith(`/folders/${folderId}/images`) && httpMethod === 'POST') {
      const { key, name } = JSON.parse(body!);
      const newImage: Image = {
        id: uuidv4(),
        folderId,
        key,
        name,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await dynamoDb.put({ TableName: imagesTable, Item: newImage }).promise();
      return {
        statusCode: 201,
        body: JSON.stringify(newImage),
      };
    }

    if (path.startsWith(`/folders/${folderId}/images/`) && httpMethod === 'DELETE') {
      const imageId = path.split('/')[4];
      const params = {
        TableName: imagesTable,
        Key: { id: imageId },
      };
      await dynamoDb.delete(params).promise();
      return {
        statusCode: 204,
        body: '',
      };
    }

    return { statusCode: 404, body: 'Not Found' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};