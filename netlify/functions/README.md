# Image Folder Management - Netlify Functions

This directory contains the serverless functions that power the Image Folder Management application's backend. These functions handle image uploads, folder management, and data persistence using Firebase.

## Architecture

The backend is built using Netlify Functions and integrates with Firebase for data storage and file management. Each function is designed to handle specific aspects of the application's functionality.

## Functions Overview

### `folders.ts`

Handles all folder-related operations:
- Create new folders
- List folders with sorting and pagination
- Update folder metadata
- Delete folders

### `images.ts`

Manages image-related operations:
- Generate upload URLs for Firebase Storage
- Create image metadata records
- List images with sorting and pagination
- Delete images and their associated files

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

## Local Development

1. Install the Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Start the development server:
```bash
netlify dev
```

This will start both the frontend application and the serverless functions.

## API Endpoints

### Folders

```typescript
POST /.netlify/functions/folders
{
  "method": "CREATE" | "READ" | "UPDATE" | "DELETE",
  "data": {
    // Folder data
  },
  "sort"?: {
    "field": "name" | "created_at" | "updated_at",
    "direction": "asc" | "desc"
  },
  "pagination"?: {
    "page": number,
    "limit": number
  }
}
```

### Images

```typescript
POST /.netlify/functions/images
{
  "method": "GET_UPLOAD_URL" | "CREATE" | "READ" | "DELETE",
  "data": {
    // Image data
  },
  "sort"?: {
    "field": "name" | "created_at" | "updated_at",
    "direction": "asc" | "desc"
  },
  "pagination"?: {
    "page": number,
    "limit": number
  }
}
```

## Error Handling

All functions follow a consistent error handling pattern:

```typescript
try {
  // Function logic
} catch (error) {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Internal server error' })
  };
}
```

## Security

- All functions validate input data before processing
- Firebase Security Rules control access to data and files
- No authentication is required as per project requirements

## Deployment

The functions are automatically deployed when pushing to the main branch if you've set up Netlify continuous deployment.

To deploy manually:

```bash
netlify deploy --prod
```

## Testing

To test the functions locally:

1. Start the development server:
```bash
netlify dev
```

2. Use tools like Postman or curl to send requests to:
```
http://localhost:8888/.netlify/functions/[function-name]
```

## Monitoring

Monitor function execution and errors through the Netlify dashboard:

1. Go to your site's dashboard
2. Navigate to Functions
3. View execution logs and error reports

## Best Practices

1. Keep functions small and focused
2. Use TypeScript for better type safety
3. Implement proper error handling
4. Follow the principle of least privilege
5. Cache frequently accessed data
6. Implement rate limiting for production

## Troubleshooting

Common issues and solutions:

1. **CORS errors**: Ensure your function includes proper headers
2. **Timeout errors**: Keep functions under the 10s limit
3. **Memory issues**: Stay within the 1024MB limit

## Support

For issues and feature requests, please create an issue in the repository.