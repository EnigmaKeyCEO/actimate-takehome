# Image Folder Management Mobile Application

A hybrid mobile application built with React Native Web, Vite, and Netlify Functions with API connectivity to either Firebase or AWS (AWS by default, and for this challenge, Firebase is also supported for testing purposes) for managing image folders and files. This application provides a seamless experience for organizing and viewing images across different folders. This project is a solution to the Actimate Take Home Challenge

## Challenge Instructions

For detailed instructions about this take-home challenge, please see [INSTRUCTIONS.md](INSTRUCTIONS.md).

## Technical Overview

This application implements a hierarchical folder structure for organizing images with the following key components:

### Backend (Netlify Functions)
- RESTful API endpoints for CRUD operations on folders and images
- AWS S3 integration for secure image storage
- DynamoDB for storing folder/image metadata and relationships

### Frontend (React Native Web)
- Responsive mobile-first UI built with React Native components
- Folder navigation with nested hierarchy support
- Image upload and preview capabilities
- Sorting and pagination of folders/images

### Data Model
- Folders: id, name, parentId, created_at, updated_at
- Images: id, folder_id, name, url, created_at, updated_at

### Storage Architecture
- Images stored in AWS S3 with pre-signed URLs for secure access
- Metadata and relationships managed in DynamoDB
- Optimized queries for listing folder contents and navigation


## Features

- 📁 Create, read, update, and delete image folders
- 🖼️ Upload and manage images within folders
- 🔄 Sort folders and images by name or date
- 📱 Responsive design that works on both mobile and desktop
- 🔥 Real-time updates using Firebase
- 💾 Secure file storage with Firebase Storage

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Firebase account and project
- Git (optional)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd image-folder-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── screens/          # Screen components
├── types/            # TypeScript type definitions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database and Storage services
3. Set up security rules for both services
4. Copy your Firebase configuration to the `.env` file

### Firestore Collections

The application uses the following collections:

- `folders`: Stores folder metadata
  - `name`: string
  - `created_at`: timestamp
  - `updated_at`: timestamp

- `images`: Stores image metadata
  - `folder_id`: string (reference to folder)
  - `name`: string
  - `url`: string
  - `created_at`: timestamp
  - `updated_at`: timestamp

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting service (e.g., Firebase Hosting, Netlify, Vercel)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.