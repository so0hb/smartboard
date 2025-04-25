import { PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { useUserStore } from '@/store';
import {snakeToCamel, camelToSnake} from '@/utils/functions/index'
export type EntityType = 'universities' | 'conversation' | 'conversation1';

export const fetchTotalCount = async (entityType: EntityType): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(entityType)
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    return count ? count[0] : 0;
  } catch (error: any) {
    console.error(`Error fetching total count from Supabase for ${entityType}:`, error.message);
    throw error;
  }
};

export const fetchData = async <T extends Record<string, any>>(
  entityType: EntityType,
  { limit, offset }: { limit: number; offset: number }
): Promise<T[]> => {
  try {
    const userStore = useUserStore();
    const userId: string = userStore.$state.user!.id!;
    console.log(userId);

    const { data, error }: PostgrestResponse<T> = await supabase
      .from(entityType)
      .select('*')
      .order('updated_at')
      .range(offset, offset + limit - 1)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

   
    const transformedData = data?.map((item) => snakeToCamel(item));

    return transformedData || [];
  } catch (error: any) {
    console.error(`Error fetching ${entityType} from Supabase:`, error.message);
    throw error;
  }
};

export const insertData = async <T extends Record<string, any>>(
  entityType: EntityType,
  data: T
): Promise<T> => {
  try {
    const snakeCaseData = camelToSnake(data);

    const { data: responseData, error } = await supabase
      .from(entityType)
      .insert([snakeCaseData])
      .select();

    if (error) {
      throw error;
    }

    const insertedData = responseData ? responseData[0] : null;

    if (!insertedData) {
      throw new Error('No data returned after insertion');
    }

    const camelCaseInsertedData = insertedData ? snakeToCamel(insertedData) : null;

    return camelCaseInsertedData as T;
  } catch (error: any) {
    throw error;
  }
};

export const deleteData = async (entityType: EntityType, id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from(entityType)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw error;
  }
};

export const updateData = async <T extends Record<string, any>>(
  entityType: EntityType,
  id: number,
  updates: Partial<T>
): Promise<void> => {
  try {
    const snakeCaseUpdates = camelToSnake(updates);

    const { error } = await supabase
      .from(entityType)
      .update(snakeCaseUpdates)
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw error;
  }
};

