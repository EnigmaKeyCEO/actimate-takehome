import { Handler } from "@netlify/functions";
import { S3 } from "./awsConfig"; // Updated import path

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
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
    const body = JSON.parse(event.body || '{}');
    const file = body.file;

    if (!file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "File is required." }),
      };
    }

    const { uri, name, type } = file;

    const key = `uploads/${name}`; // Define the S3 key for the uploaded file

    const params = {
      Bucket: process.env.VITE_S3_BUCKET_NAME!,
      Key: key,
      Body: Buffer.from(uri, 'base64'), // Convert the base64 string to a buffer
      ContentType: type,
    };

    await S3.upload(params).promise();

    const fileUrl = `https://${process.env.VITE_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: fileUrl }),
    };
  } catch (error) {
    console.error("Error handling file upload:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
