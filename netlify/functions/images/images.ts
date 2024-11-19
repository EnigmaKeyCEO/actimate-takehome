import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    const { method, data, sort, pagination } = JSON.parse(event.body);

    let query = supabase.from('images');

    switch (method) {
      case 'GET_UPLOAD_URL':
        const putCommand = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: `images/${Date.now()}-${data.filename}`,
          ContentType: data.contentType,
        });

        const uploadUrl = await getSignedUrl(s3Client, putCommand, {
          expiresIn: 3600,
        });

        return {
          statusCode: 200,
          body: JSON.stringify({ uploadUrl }),
        };

      case 'CREATE':
        const { data: created, error: createError } = await query.insert(data);
        if (createError) throw createError;
        return {
          statusCode: 201,
          body: JSON.stringify(created),
        };

      case 'READ':
        if (sort) {
          query = query.order(sort.field, { ascending: sort.direction === 'asc' });
        }
        if (pagination) {
          const { page, limit } = pagination;
          query = query
            .range(page * limit, (page + 1) * limit - 1)
            .select('*', { count: 'exact' });
        }
        const { data: images, error: readError } = await query;
        if (readError) throw readError;
        return {
          statusCode: 200,
          body: JSON.stringify(images),
        };

      case 'DELETE':
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: data.key,
        });
        await s3Client.send(deleteCommand);

        const { error: deleteError } = await query.delete().eq('id', data.id);
        if (deleteError) throw deleteError;
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};