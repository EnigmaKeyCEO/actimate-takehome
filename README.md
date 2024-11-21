# Image Folder Management Mobile Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE/deploy-status)](https://app.netlify.com/sites/actimate-takehome/deploys)

## Introduction
This project is a mobile application built with Expo (React Native) and TypeScript, allowing users to manage image folders and images with CRUD operations and pagination.

## Setup Instructions

### Prerequisites
- **Node.js and npm**: Download and install from [nodejs.org](https://nodejs.org/).
- **Expo CLI**: Install globally using the command `npm install -g expo-cli`.
- **iOS Simulator**: Requires Xcode on macOS. Download from the Mac App Store.
- **EAS CLI**: Install using `npm install -g eas-cli`.

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
VITE_S3_BUCKET=your_s3_bucket
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
