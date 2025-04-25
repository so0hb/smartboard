import { supabase } from '@/utils/supabase';
import { camelToSnake, snakeToCamel } from '@/utils/functions';

// Utility function to fetch data from a table
export const fetchDataFromTable = async <T>(
  tableName: string,
  limit: number,
  offset: number,
  filters?: { [key: string]: any } 
): Promise<{ data: T[]; totalCount: number }> => {
  try {
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters if provided
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
    }

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const camelData = data?.map(snakeToCamel) || [];
    return { data: camelData as T[], totalCount: count || 0 };
  } catch (error: any) {
    console.error(`Error fetching data from ${tableName}:`, error.message);
    throw error;
  }
};

// Utility function to insert data into a table
export const insertDataIntoTable = async <T>(
  tableName: string,
  dataInserted: T
): Promise<T> => {
  try {
    const snakeData = [dataInserted as any].map(camelToSnake);

    const { data, error } = await supabase
      .from(tableName)
      .insert(snakeData)
      .select();

    if (error) {
      throw error;
    }

    const inserted = data ? data[0] : null;
    if (!inserted) {
      throw new Error('No data returned after insertion');
    }
    const camelData = [inserted].map(snakeToCamel);
    return camelData[0] as T;
  } catch (error: any) {
    throw error;
  }
};

// Utility function to delete data from a table
export const deleteDataFromTable = async (tableName: string, id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw error;
  }
};

// Utility function to update data in a table
export const updateDataInTable = async <T>(
  tableName: string,
  data: T
): Promise<void> => {
  try {
    const snakeData = [data as any].map(camelToSnake);
    const { error } = await supabase
      .from(tableName)
      .update(snakeData[0])
      .eq('id', (data as any).id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw error;
  }
};

// Utility function to get image URL from Supabase
export const getImageUrl = async (bucket: string, imageName: string): Promise<string> => {
  try {
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(imageName);
    return data.publicUrl;
  } catch (error: any) {
    console.error('Error fetching image URL:', error.message);
    throw error;
  }
};
