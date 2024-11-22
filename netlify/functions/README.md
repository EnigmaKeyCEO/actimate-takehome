# ACTIMATE: <br />&nbsp;&nbsp;TAKE HOME CHALLENGE <br />&nbsp;&nbsp;- BACKEND

| Production | Development |
|------------|-------------|
| [![Netlify Status](https://api.netlify.com/api/v1/badges/7d0fb964-5b89-4611-97b7-9c5e2876147c/deploy-status)](https://app.netlify.com/sites/actimate-takehome/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/7d0fb964-5b89-4611-97b7-9c5e2876147c/deploy-status?branch=develop)](https://app.netlify.com/sites/actimate-takehome/deploys) |

## TLDR?:
- Jump to the [API Documentation](#api-documentation)

## Production URL
[https://actimate-takehome.netlify.app/api/](https://actimate-takehome.netlify.app/api/)

## Development URL
[https://develop--actimate-takehome.netlify.app/api/](https://develop--actimate-takehome.netlify.app/api/)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Additional Documentation](#additional-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
  - [Folders API](#folders-api)
  - [Files API](#files-api)
- [Testing](#testing)
- [Contributing](#contributing)
- [Additional Notes](#additional-notes)
- [License](#license)

## Introduction
Actimate Takehome is a comprehensive mobile application designed to manage image folders with ease. Built with **Expo (React Native)** and **TypeScript**, it provides functionalities for creating, reading, updating, and deleting folders and images, alongside efficient pagination and sorting options. The backend leverages **AWS services** to ensure scalability, security, and reliability.

## Features
- **Folder Management**: Create, Read, Update, Delete folders seamlessly.
- **Image Management**: Manage images within folders with full CRUD operations.
- **Pagination and Sorting**: Efficiently handle large datasets with intuitive pagination and sorting features.
- **Responsive UI**: Ensures compatibility with both iOS simulators and actual devices for a smooth user experience.
- **Backend Integration**: Robust backend using AWS services (S3, DynamoDB) for data storage and retrieval.
- **API Endpoints**: Secure and efficient API endpoints hosted on Netlify Functions for handling all operations.
- **Signed URLs**: Secure image uploads and downloads using AWS S3 signed URLs.
- **Monorepo Structure**: Unified codebase targeting iOS, web, and server platforms within a single repository.
- **Code Quality Tools**: Integrated linting and testing frameworks to maintain high code standards.
- **Continuous Integration/Deployment**: Automated pipelines ensuring reliable deployments and updates.

## Setup Instructions

### Prerequisites
- **Node.js and npm**: Download and install from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install globally using the command `npm install -g expo-cli`.
- **EAS CLI**: Install using `npm install -g eas-cli`.
- **Netlify CLI**: Install using `npm install -g netlify-cli`.
- **iOS Simulator**: Requires Xcode on macOS. Download from the Mac App Store.
- **AWS Account**: Set up AWS services for S3 and DynamoDB integrations.
- **GitHub Account**: Ensure you have access to the repository and necessary permissions.

### Installation
1. **Clone the repository**:
   Open your terminal and run:
   ```bash
   git clone https://github.com/EnigmaKeyCEO/actimate-takehome.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd actimate-takehome
   ```
3. **Install dependencies**:
   Run the following command to install all necessary packages:
   ```bash
   npm install
   ```
4. **Initialize Git Submodules** (if any):
   ```bash
   git submodule update --init --recursive
   ```
5. **Run Database Migrations** (if applicable):
   ```bash
   npm run migrate
   ```
   Ensure that DynamoDB tables are correctly set up as per the [Backend API Documentation](#api-documentation).

### Running the Application
- **Start the development server**:
  ```bash
  npm run start
  ```
  This initializes the Expo development server, enabling live reloading and debugging.

- **Run the web version**:
  ```bash
  npm run web
  ```
  Launches the application in a web browser using Vite as the build tool.

- **Test functions locally**:
  ```bash
  npm run dev
  ```
  Runs Netlify Functions and the Expo development server concurrently, allowing you to test serverless functions alongside the frontend.

- **Test iOS locally**:
  ```bash
  npm run dev:ios
  ```
  Opens the application in the iOS simulator and connects it with the development server for testing on iOS devices.

- **Run on Android** (Optional):
  ```bash
  npm run android
  ```
  Ensure that an Android emulator is running or an Android device is connected.

### Additional Documentation
For more detailed guides on specific aspects of the project, refer to the following documents:
- [Deployment Instructions](DEPLOY_README.md)
- [Development Process](DEVELOP_README.md)
- [Local Environment Setup](LOCAL_README.md)

## Deployment
Deployment is handled through **Netlify** for the frontend and **AWS** for backend services. Detailed steps are provided in the [Deployment Instructions](DEPLOY_README.md).

- **Develop Branch**: [https://develop--actimate-takehome.netlify.app/](https://develop--actimate-takehome.netlify.app/)
- **Production (Main Branch)**: [https://actimate-takehome.netlify.app/](https://actimate-takehome.netlify.app/)
- **API Endpoints**: Hosted at `/api/*` where `*` is the filename without extension.

## Environment Variables
Configuration is managed through environment variables to maintain security and flexibility.

Create a `.env` file in the root directory and add the following:
```bash
VITE_API_BASE_URL=https://actimate-takehome.netlify.app/api
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_REGION=your_aws_region
VITE_S3_BUCKET_NAME=your_s3_bucket
VITE_AWS_ACCESS_URL_KEY=your_access_url_key
```
Ensure that these variables are securely managed and never committed to version control.

## Architecture
The project follows a **monorepo** structure, combining both frontend and backend codebases for streamlined development and deployment.

### Frontend (Mobile Client)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Context API and custom hooks
- **Navigation**: React Navigation for seamless screen transitions
- **UI Components**: Modular and reusable components for consistency

### Backend API
- **Hosting**: Netlify Functions (Serverless Lambdas)
- **Services**: AWS S3 for image storage, DynamoDB for metadata storage
- **Security**: IAM roles and policies to secure AWS resources
- **API Design**: RESTful endpoints with proper error handling and validation

## API Documentation

### Folders API
The Folders API manages all operations related to folders within the application. Each folder can contain multiple files, and the API supports CRUD (Create, Read, Update, Delete) operations.

**Base URL**: `/api/folders`

#### Available Methods

- **GET `/api/folders`**
  - **Purpose**: Retrieve a list of folders.
  - **Parameters**:
    - `parentId` (optional): The ID of the parent folder. Defaults to `"root"` if not provided.
    - `lastKey` (optional): For pagination, the key to start from.
  - **Response**:
    - `folders`: An array of folder objects.
    - `lastKey`: The key for the next set of results (if any).
  
  - **Example Request**:
    ```bash
    curl https://actimate-takehome.netlify.app/api/folders?parentId=parent123&lastKey=eyJrZXkiOiJ2YWx1ZSJ9
    ```

- **POST `/api/folders`**
  - **Purpose**: Create a new folder.
  - **Body**:
    ```json
    {
      "name": "New Folder",
      "parentId": "parent123" // Optional, defaults to "root"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `folder`: The created folder object.
  
  - **Example Request**:
    ```bash
    curl -X POST https://actimate-takehome.netlify.app/api/folders \
    -H "Content-Type: application/json" \
    -d '{"name": "New Folder", "parentId": "parent123"}'
    ```

- **PUT `/api/folders`**
  - **Purpose**: Update an existing folder.
  - **Body**:
    ```json
    {
      "id": "folder123",
      "name": "Updated Folder Name"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `folder`: The updated folder object.
  
  - **Example Request**:
    ```bash
    curl -X PUT https://actimate-takehome.netlify.app/api/folders \
    -H "Content-Type: application/json" \
    -d '{"id": "folder123", "name": "Updated Folder Name"}'
    ```

- **DELETE `/api/folders`**
  - **Purpose**: Delete a folder.
  - **Body**:
    ```json
    {
      "id": "folder123"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
  
  - **Example Request**:
    ```bash
    curl -X DELETE https://actimate-takehome.netlify.app/api/folders \
    -H "Content-Type: application/json" \
    -d '{"id": "folder123"}'
    ```

**Setup and Configuration**:
- Ensure that the Netlify CLI is installed and logged in.
- Environment variables for DynamoDB table names must be configured in Netlify Dashboard.
- AWS credentials with appropriate permissions should be set in environment variables.

### Files API
The Files API manages all operations related to files within folders. It supports CRUD operations and handles secure file uploads via pre-signed URLs.

**Base URL**: `/api/files`

#### Available Methods

- **GET `/api/files`**
  - **Purpose**: Retrieve a list of files within a specific folder.
  - **Parameters**:
    - `folderId`: The ID of the folder to retrieve files from.
    - `lastKey` (optional): For pagination, the key to start from.
  - **Response**:
    - `files`: An array of file objects.
    - `lastKey`: The key for the next set of results (if any).
  
  - **Example Request**:
    ```bash
    curl https://actimate-takehome.netlify.app/api/files?folderId=folder123&lastKey=eyJrZXkiOiJ2YWx1ZSJ9
    ```

- **POST `/api/files`**
  - **Purpose**: Upload a new file to a folder.
  - **Body**:
    ```json
    {
      "folderId": "folder123",
      "file": {
        "originalFilename": "image.png",
        "contentType": "image/png",
        "data": "base64-encoded-data"
      }
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `fileId`: The ID of the uploaded file.
    - `signedUrl`: Pre-signed URL for uploading the file to S3.
    - `key`: The S3 key for the file.
  
  - **Example Request**:
    ```bash
    curl -X POST https://actimate-takehome.netlify.app/api/files \
    -H "Content-Type: application/json" \
    -d '{
          "folderId": "folder123",
          "file": {
            "originalFilename": "image.png",
            "contentType": "image/png",
            "data": "base64-encoded-data"
          }
        }'
    ```

- **PUT `/api/files`**
  - **Purpose**: Update an existing file's metadata.
  - **Body**:
    ```json
    {
      "id": "file123",
      "name": "Updated Image Name.png"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `file`: The updated file object.
  
  - **Example Request**:
    ```bash
    curl -X PUT https://actimate-takehome.netlify.app/api/files \
    -H "Content-Type: application/json" \
    -d '{"id": "file123", "name": "Updated Image Name.png"}'
    ```

- **DELETE `/api/files`**
  - **Purpose**: Delete a file.
  - **Body**:
    ```json
    {
      "id": "file123"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
  
  - **Example Request**:
    ```bash
    curl -X DELETE https://actimate-takehome.netlify.app/api/files \
    -H "Content-Type: application/json" \
    -d '{"id": "file123"}'
    ```

**Setup and Configuration**:
- Ensure that the Netlify CLI is installed and logged in.
- Environment variables for S3 bucket names and DynamoDB table names must be configured in Netlify Dashboard.
- AWS credentials with appropriate permissions should be set in environment variables.

## API Documentation

### Folders API
The Folders API manages all operations related to folders within the application. Each folder can contain multiple files, and the API supports CRUD (Create, Read, Update, Delete) operations.

**Base URL**: `/api/folders`

#### Available Methods

- **GET `/api/folders`**
  - **Purpose**: Retrieve a list of folders.
  - **Parameters**:
    - `parentId` (optional): The ID of the parent folder. Defaults to `"root"` if not provided.
    - `lastKey` (optional): For pagination, the key to start from.
  - **Response**:
    - `folders`: An array of folder objects.
    - `lastKey`: The key for the next set of results (if any).
  
  - **Example Request**:
    ```bash
    curl https://actimate-takehome.netlify.app/api/folders?parentId=parent123&lastKey=eyJrZXkiOiJ2YWx1ZSJ9
    ```

- **POST `/api/folders`**
  - **Purpose**: Create a new folder.
  - **Body**:
    ```json
    {
      "name": "New Folder",
      "parentId": "parent123" // Optional, defaults to "root"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `folder`: The created folder object.
  
  - **Example Request**:
    ```bash
    curl -X POST https://actimate-takehome.netlify.app/api/folders \
    -H "Content-Type: application/json" \
    -d '{"name": "New Folder", "parentId": "parent123"}'
    ```

- **PUT `/api/folders`**
  - **Purpose**: Update an existing folder.
  - **Body**:
    ```json
    {
      "id": "folder123",
      "name": "Updated Folder Name"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `folder`: The updated folder object.
  
  - **Example Request**:
    ```bash
    curl -X PUT https://actimate-takehome.netlify.app/api/folders \
    -H "Content-Type: application/json" \
    -d '{"id": "folder123", "name": "Updated Folder Name"}'
    ```

- **DELETE `/api/folders`**
  - **Purpose**: Delete a folder.
  - **Body**:
    ```json
    {
      "id": "folder123"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
  
  - **Example Request**:
    ```bash
    curl -X DELETE https://actimate-takehome.netlify.app/api/folders \
    -H "Content-Type: application/json" \
    -d '{"id": "folder123"}'
    ```

### Files API
The Files API manages all operations related to files within folders. It supports CRUD operations and handles secure file uploads via pre-signed URLs.

**Base URL**: `/api/files`

#### Available Methods

- **GET `/api/files`**
  - **Purpose**: Retrieve a list of files within a specific folder.
  - **Parameters**:
    - `folderId`: The ID of the folder to retrieve files from.
    - `lastKey` (optional): For pagination, the key to start from.
  - **Response**:
    - `files`: An array of file objects.
    - `lastKey`: The key for the next set of results (if any).
  
  - **Example Request**:
    ```bash
    curl https://actimate-takehome.netlify.app/api/files?folderId=folder123&lastKey=eyJrZXkiOiJ2YWx1ZSJ9
    ```

- **POST `/api/files`**
  - **Purpose**: Upload a new file to a folder.
  - **Body**:
    ```json
    {
      "folderId": "folder123",
      "file": {
        "originalFilename": "image.png",
        "contentType": "image/png",
        "data": "base64-encoded-data"
      }
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `fileId`: The ID of the uploaded file.
    - `signedUrl`: Pre-signed URL for uploading the file to S3.
    - `key`: The S3 key for the file.
  
  - **Example Request**:
    ```bash
    curl -X POST https://actimate-takehome.netlify.app/api/files \
    -H "Content-Type: application/json" \
    -d '{
          "folderId": "folder123",
          "file": {
            "originalFilename": "image.png",
            "contentType": "image/png",
            "data": "base64-encoded-data"
          }
        }'
    ```

- **PUT `/api/files`**
  - **Purpose**: Update an existing file's metadata.
  - **Body**:
    ```json
    {
      "id": "file123",
      "name": "Updated Image Name.png"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
    - `file`: The updated file object.
  
  - **Example Request**:
    ```bash
    curl -X PUT https://actimate-takehome.netlify.app/api/files \
    -H "Content-Type: application/json" \
    -d '{"id": "file123", "name": "Updated Image Name.png"}'
    ```

- **DELETE `/api/files`**
  - **Purpose**: Delete a file.
  - **Body**:
    ```json
    {
      "id": "file123"
    }
    ```
  - **Response**:
    - `message`: Confirmation message.
  
  - **Example Request**:
    ```bash
    curl -X DELETE https://actimate-takehome.netlify.app/api/files \
    -H "Content-Type: application/json" \
    -d '{"id": "file123"}'
    ```

## Testing
- **Unit Tests**: Implemented using Jest for frontend components and backend functions.
- **Integration Tests**: Ensuring end-to-end functionality between frontend and backend.
- **Linting**: Enforced using ESLint to maintain code quality.
- **Continuous Integration**: Automated testing and deployment pipelines set up with GitHub Actions.

Run tests using:
```bash
npm test
```

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. **Fork the repository**.
2. **Create a feature branch** for your enhancements:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a pull request** on the main repository, detailing your changes and their purpose.

Please ensure that your contributions adhere to the project's code standards and include necessary documentation and tests.

Refer to the [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Additional Notes
- **Dependency Management**: Regularly update dependencies to patch vulnerabilities and improve performance.
- **Accessibility**: Ensured the application is accessible to all users by following best practices.
- **Performance Optimization**: Implemented lazy loading and efficient data fetching strategies.
- **Scalability**: Designed the architecture to handle increased loads and future feature expansions seamlessly.

## License
This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for more information.
