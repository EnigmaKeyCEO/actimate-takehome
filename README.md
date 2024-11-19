# Image Folder Management Mobile Application

## Introduction
This project is a mobile application built with Expo (React Native) and TypeScript, allowing users to manage image folders and images with CRUD operations and pagination.

## Setup Instructions

### Prerequisites
- Node.js and npm
- Expo CLI
- iOS Simulator or an actual iPhone device

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/actimate-takehome.git
   ```
2. Navigate to the project directory:
   ```bash
   cd actimate-takehome
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development web server:
   ```bash
   npm run web
   ```

### Running on iOS
- Ensure you have Xcode installed.
- Run:
  ```bash
  npm run ios
  ```
- The app should launch on the iOS simulator or an actual device.

## Building for Production
Use Expo's EAS CLI for building:
```bash
npx eas build --platform ios
```

Ensure your EAS CLI is configured properly.

## Environment Variables
Configure necessary environment variables for API endpoints if required.
```bash
VITE_API_BASE_URL=https://your-netlify-project.netlify.app/.netlify/functions
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