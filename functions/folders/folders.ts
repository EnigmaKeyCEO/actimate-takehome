import { Handler } from '@netlify/functions';
import { getStorageAdapter } from '../utils/storageFactory';
import { FolderData, SortOptions, PaginationOptions } from '../adapters/StorageAdapter';

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
      case 'CREATE':
        const folder = await storage.createFolder(data);
        return {
          statusCode: 201,
          body: JSON.stringify(folder),
        };

      case 'READ':
        const folders = await storage.listFolders(sort, pagination);
        return {
          statusCode: 200,
          body: JSON.stringify(folders),
        };

      case 'UPDATE':
        const updated = await storage.updateFolder(data.id, data);
        return {
          statusCode: 200,
          body: JSON.stringify(updated),
        };

      case 'DELETE':
        await storage.deleteFolder(data.id);
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