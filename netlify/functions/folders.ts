import { Handler } from "@netlify/functions";
import { dynamoDb } from "./awsConfig";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
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
    const params = {
      TableName: process.env.VITE_DYNAMODB_FOLDERS_TABLE_NAME ?? "Folders",
    };

    const data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error("Error fetching folders:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
