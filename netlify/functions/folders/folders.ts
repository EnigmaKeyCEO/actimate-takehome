import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    const { method, data, sort, pagination } = JSON.parse(event.body);

    let query = supabase.from('folders');

    switch (method) {
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
        const { data: folders, error: readError } = await query;
        if (readError) throw readError;
        return {
          statusCode: 200,
          body: JSON.stringify(folders),
        };

      case 'UPDATE':
        const { data: updated, error: updateError } = await query
          .update(data)
          .eq('id', data.id);
        if (updateError) throw updateError;
        return {
          statusCode: 200,
          body: JSON.stringify(updated),
        };

      case 'DELETE':
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