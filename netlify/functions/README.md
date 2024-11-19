# Image Folder Management Backend API

## Introduction
This backend API provides endpoints for managing image folders and images, including CRUD operations and generating signed URLs for AWS S3.

## Setup Instructions

### Prerequisites
- AWS account with S3 and DynamoDB access
- Node.js and npm

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file with the following:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   S3_BUCKET_NAME=your_s3_bucket_name
   ```
4. Deploy using Netlify Functions:
   Ensure Netlify is configured to handle functions from the `/netlify/functions` directory.

### Running Locally
You can test functions locally with Netlify CLI:
```bash
npm install -g netlify-cli
netlify dev
```

## API Endpoints

### Folders
- **GET /folders**
  - Description: List folders with pagination.
  - Query Parameters:
    - `page`: Page number
    - `sort`: Sort criteria
- **POST /folders**
  - Description: Create a new folder.
  - Body:
    ```json
    { "name": "Folder Name" }
    ```
- **PUT /folders/:id**
  - Description: Update a folder.
  - Body:
    ```json
    { "name": "Updated Folder Name" }
    ```
- **DELETE /folders/:id**
  - Description: Delete a folder.

### Images
- **GET /folders/:folderId/images**
  - Description: List images in a folder with pagination.
  - Query Parameters:
    - `page`: Page number
    - `sort`: Sort criteria
- **GET /folders/:folderId/images/upload?filename=**
  - Description: Get a signed URL for uploading an image.
- **POST /folders/:folderId/images**
  - Description: Create an image record after upload.
  - Body:
    ```json
    { "key": "s3_key", "name": "Image Name" }
    ```
- **DELETE /folders/:folderId/images/:id**
  - Description: Delete an image.

## AWS Integration

### S3
- **Bucket Name**: Defined in `S3_BUCKET_NAME` environment variable.
- **Permissions**: Ensure proper CORS and bucket policies are set to allow signed URL operations.

### DynamoDB
- **Tables**:
  - **Folders**
    - Primary Key: `id` (String)
    - Attributes: `name`, `createdAt`, `updatedAt`
  - **Images**
    - Primary Key: `id` (String)
    - Attributes: `folderId`, `key`, `name`, `url`, `createdAt`, `updatedAt`
    - **GSI**: `folderId-index` on `folderId` attribute for querying images by folder.

## Deployment

### AWS CDK (Optional)
Provide infrastructure as code scripts if applicable, e.g.,
```typescript
// cdk-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ActimateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'ImagesBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const foldersTable = new dynamodb.Table(this, 'FoldersTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    const imagesTable = new dynamodb.Table(this, 'ImagesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      globalSecondaryIndexes: [{
        indexName: 'folderId-index',
        partitionKey: { name: 'folderId', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      }]
    });

    // Add permissions, etc., as needed
  }
}
```

### Deployment Steps
Provide clear steps for deploying backend functions and ensuring they are correctly linked with Netlify.

## Environment Variables
List all required environment variables and their descriptions.

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_s3_bucket_name
```

Ensure these are set in your Netlify dashboard under **Environment Variables**.

## Troubleshooting
Include common issues and solutions.

```
- **Issue**: Unable to generate signed URLs.
  - **Solution**: Check AWS credentials and ensure the S3 bucket policies allow PUT operations.
  
- **Issue**: DynamoDB connection errors.
  - **Solution**: Verify AWS region and credentials.
```
