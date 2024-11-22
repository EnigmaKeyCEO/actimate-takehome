import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

export const listS3Objects = async (
  S3: S3Client,
  bucket: string,
  prefix: string,
  continuationToken?: string,
  maxKeys: number = 20
) => {
  const params = {
    Bucket: bucket,
    Prefix: prefix,
    ContinuationToken: continuationToken,
    MaxKeys: maxKeys,
  };
  const command = new ListObjectsV2Command(params);
  return await S3.send(command);
};

export const queryDynamoDB = async (
  dynamoDb: DynamoDBClient,
  tableName: string,
  indexName: string,
  keyCondition: string,
  expressionValues: any,
  exclusiveStartKey?: any,
  limit: number = 20
) => {
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyCondition,
    ExpressionAttributeValues: expressionValues,
    ScanIndexForward: true,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  };
  const command = new QueryCommand(params);
  return await dynamoDb.send(command);
}; 