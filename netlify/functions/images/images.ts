import { Handler } from '@netlify/functions';
import { getStorageAdapter } from '../utils/storageFactory';
import { ImageData, SortOptions, PaginationOptions } from '../adapters/StorageAdapter';

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    const { method, data, sort, pagination } = JSON.parse(event.body);
    const storage = await getStorageAdapter();

    switch (method) {
      case 'GET_UPLOAD_URL':
        const uploadData = await storage.getUploadUrl(data.filename, data.contentType);
        return {
          statusCode: 200,
          body: JSON.stringify(uploadData),
        };

      case 'CREATE':
        const image = await storage.createImage(data);
        return {
          statusCode: 201,
          body: JSON.stringify(image),
        };

      case 'READ':
        const images = await storage.listImages(sort, pagination);
        return {
          statusCode: 200,
          body: JSON.stringify(images),
        };

      case 'DELETE':
        await storage.deleteImage(data.id, data.filename);
        return {
          statusCode: 204,
          body: '',
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid method' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};