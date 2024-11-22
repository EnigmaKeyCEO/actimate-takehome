# ACTIMATE: <br />&nbsp;&nbsp;TAKE HOME CHALLENGE

| Production | Development |
|------------|-------------|
| [![Netlify Status](https://api.netlify.com/api/v1/badges/7d0fb964-5b89-4611-97b7-9c5e2876147c/deploy-status)](https://app.netlify.com/sites/actimate-takehome/deploys) | [![Netlify Status](https://api.netlify.com/api/v1/badges/7d0fb964-5b89-4611-97b7-9c5e2876147c/deploy-status?branch=develop)](https://app.netlify.com/sites/actimate-takehome/deploys) |

## Production URL
[https://actimate-takehome.netlify.app/](https://actimate-takehome.netlify.app/)

## Development URL
[https://develop--actimate-takehome.netlify.app/](https://develop--actimate-takehome.netlify.app/)


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
- [Testing](#testing)
- [Contributing](#contributing)
- [Additional Notes](#additional-notes)
- [License](#license)


## Introduction
Actimate Takehome is a comprehensive mobile application designed to manage image folders with ease. Built with **Expo (React Native)** and **TypeScript**, it provides functionalities for creating, reading, updating, and deleting folders and images, alongside efficient pagination and sorting options. The backend leverages **AWS services** to ensure scalability, security, and reliability.

## Development Journey

I wanted to share some insights from my experience building this project. Throughout the process, I learned quite a few things and faced some challenges due to initial misconceptions.

Initially, I misinterpreted the requirements and assumed that AWS services could be easily interchanged with Firebase. As a result, I built an entire project around Firebase. However, after revisiting the requirements, I realized that AWS and S3 were explicitly specified multiple times. This realization prompted me to reassess my approach.

I then began reconstructing the project using AWS and attempted to merge it with my existing Firebase-based project. Unfortunately, this merging process did not go smoothly. Despite the setbacks, my ultimate goal was to create a unified codebase that contains both the API and the app code, all written in TypeScript. I aimed for a single repository that could target iOS, web, and server platforms, leveraging the same API from a monorepo setup.

## Project Structure
```
actimate-takehome/
├── src/
│   ├── App.tsx              - Main application entry point
│   ├── index.js             - Bootstraps the application
│   ├── screens/             - Contains screen components
│   │   └── MainScreen.tsx
│   ├── components/          - Reusable UI components
│   │   ├── actions/
│   │   ├── modals/
│   │   ├── headers/
│   │   ├── folders/
│   │   ├── files/
│   │   ├── Breadcrumb.tsx
│   │   └── Modal.tsx
│   ├── hooks/               - Custom React hooks
│   ├── providers/           - Context providers
│   └── types/               - TypeScript type definitions
├── README.md
├── package.json
├── .env
├── assets/                  - Static assets like images and fonts
├── netlify/
│   └── functions/           - Serverless Lambda functions
│       ├── awsConfig.ts     - AWS configuration
│       ├── folders.ts       - Lambda function for folder operations
│       └── files.ts         - Lambda function for file operations
├── eas.json                 - EAS configuration
├── netlify.toml             - Netlify configuration
├── app.json                 - Expo configuration
├── index.js                 - Bootstraps the application
├── tsconfig.json            - TypeScript configuration
├── tailwind.config.js       - Tailwind CSS configuration (for web)
├── vite.config.ts           - Vite configuration (important for web)
└── package.json             - Project dependencies and scripts
```

## Setup Instructions

### Prerequisites
- **Node.js and npm**: Download and install from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install globally using the command `npm install -g expo-cli`.
- **EAS CLI**: Install using `npm install -g eas-cli`.
- **Netlify CLI**: Install using `npm install -g netlify-cli`.
- **iOS Simulator**: Requires Xcode on macOS. Download from the Mac App Store.
- **AWS Account**: Set up AWS services for S3 and DynamoDB integrations.

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

### Running the Application
- **Start the development server**:
  ```bash
  npm run start
  ```
- **Run the web version**:
  ```bash
  npm run web
  ```
- **Test functions locally**:
  ```bash
  npm run dev
  ```
- **Test iOS locally**:
  ```bash
  npm run dev:ios
  ```

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
VITE_AWS_BUCKET_NAME=your_s3_bucket
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

## Features
- **Folder Management**: Create, Read, Update, Delete folders seamlessly.
- **Image Management**: Manage images within folders with full CRUD operations.
- **Pagination and Sorting**: Efficiently handle large datasets with intuitive pagination and sorting features.
- **Responsive UI**: Ensures compatibility with both iOS simulators and actual devices for a smooth user experience.
- **Backend Integration**: Robust backend using AWS services (S3, DynamoDB) for data storage and retrieval.
- **API Endpoints**: Secure and efficient API endpoints hosted on Netlify Functions for handling all operations.
- **Signed URLs**: Secure image uploads and downloads using AWS S3 signed URLs.
- **Monorepo Structure**: Unified codebase targeting iOS, web, and server platforms within a single repository.

### Backend API
- **Hosting**: Netlify Functions (Serverless Lambdas)
- **Services**: AWS S3 for image storage, DynamoDB for metadata storage
- **Security**: IAM roles and policies to secure AWS resources
- **API Design**: RESTful endpoints with proper error handling and validation

## API Documentation
Detailed documentation of all API endpoints is available [here](docs/API_Documentation.md). This includes information on request parameters, responses, and example usage.

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
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Push to your fork and open a pull request detailing your changes.

Refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## Additional Notes
- **Dependency Management**: Regularly update dependencies to patch vulnerabilities and improve performance.
- **Performance Optimization**: Implemented lazy loading and efficient data fetching strategies.
- **Accessibility**: Ensured the application is accessible to all users by following best practices.

## License
This project is licensed under the [MIT License](LICENSE). See the `LICENSE` file for more information.
