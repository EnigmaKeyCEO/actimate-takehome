import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION, // e.g., 'us-west-2'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const S3 = new AWS.S3();
export const dynamoDb = new AWS.DynamoDB.DocumentClient();
