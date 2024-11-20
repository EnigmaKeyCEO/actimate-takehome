import AWS from 'aws-sdk';

console.log("AWS Region:", process.env.AWS_REGION);

const config = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
};

if (config.region && config.credentials.accessKeyId && config.credentials.secretAccessKey) {
  AWS.config.update(config);
} else {
  throw new Error("AWS config is missing required values");
}

export const S3 = new AWS.S3();
export const dynamoDb = new AWS.DynamoDB.DocumentClient();
