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
- [Additional Notes](#additional-notes)
- [License](#license)


## Introduction
This project is a mobile application built with Expo (React Native) and TypeScript, allowing users to manage image folders and images with CRUD operations and pagination.

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
- **iOS Simulator**: Requires Xcode on macOS. Download from the Mac App Store.
- **EAS CLI**: Install using `npm install -g eas-cli`.

### Installation
1. **Global Packages**:
   - **EAS CLI**: `npm install -g eas-cli`
   - **Netlify CLI**: `npm install -g netlify-cli`

2. **Clone the repository**:
   Open your terminal and run:
   ```bash
   git clone https://github.com/EnigmaKeyCEO/actimate-takehome.git
   ```
3. **Navigate to the project directory**:
   ```bash
   cd actimate-takehome
   ```
4. **Install dependencies**:
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
- [Deployment Instructions](DEPLOY_README.md)
- [Development Process](DEVELOP_README.md)
- [Local Environment Setup](LOCAL_README.md)


## Deployment
- **Develop Branch**: [https://develop--actimate-takehome.netlify.app/](https://develop--actimate-takehome.netlify.app/)
- **Production (Main Branch)**: [https://actimate-takehome.netlify.app/](https://actimate-takehome.netlify.app/)
- **API Endpoints**: Hosted at `/api/*` where `*` is the filename without extension.

## Environment Variables
Configure necessary environment variables for API endpoints if required.
Create a `.env` file in the root directory and add:
```bash
VITE_API_BASE_URL=https://actimate-takehome.netlify.app/api
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_REGION=your_aws_region
VITE_AWS_BUCKET_NAME=your_s3_bucket
VITE_AWS_ACCESS_URL_KEY=your_access_url_key
```

## Features
- **Folder Management**: Create, Read, Update, Delete folders.
- **Image Management**: Create, Read, Update, Delete images within folders.
- **Pagination and Sorting**: Efficiently handle large datasets with pagination and sorting options.
- **Responsive UI**: Compatible with both iOS simulator and actual devices.

## Additional Notes
- Ensure all dependencies are up to date.
- Check for any platform-specific requirements in the Expo documentation.
- Review the codebase for any TODOs or console logs before deploying to production.
