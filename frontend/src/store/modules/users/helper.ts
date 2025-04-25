import { adminAuthClient, supabase } from '@/utils/supabase';
import { snakeToCamel } from '@/utils/functions';
import { useUserStore } from '../user';
import { useChatStore } from '@/store';
import { router } from '@/router';



export const fetchData = async ({
  limit,
  offset,
  userType
}: {
  limit: number;
  offset: number;
  userType: string;
}): Promise<{ data: API.UserData[]; totalCount: number }> => {
  try {
    const { data, count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact' }) 
    .eq('user_type', userType)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);
  

    if (error) {
      if (error.code === 'PGRST301') {
        const userStore = useUserStore();
        const chatStore = useChatStore();
        userStore.resetUserState();
        chatStore.resetChatState();
        await router.push({ name: 'login' });
      } else {
        throw error;
      }
    }

    if (error) {
      throw error;
    }

    const camelData = data?.map(snakeToCamel) || [];
    return { data: camelData as API.UserData[], totalCount: count || 0 };

  } catch (error: any) {
    console.error('Error fetching users from Supabase:', error.code, error.message);
    throw error;
  }
};



export const insertData = async (dataInserted: API.UserData): Promise<API.UserData> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([dataInserted])
      .select();

    if (error) {
      throw error;
    }
    const inserted = data ? data[0] : null;

    if (!inserted) {
      throw new Error('No data returned after insertion');
    }

    return inserted

  } catch (error: any) {
    throw error;
  }
};

export const deleteData = async (id: string): Promise<void> => {
  try {
    // Delete the user from Supabase Auth
    const { error } = await adminAuthClient.deleteUser(id);

    if (error) {
      throw error;
    }

    // Optionally, if you need to also delete user-related data from your database, you can do that here
    // const { error: dbError } = await supabase
    //   .from('users')
    //   .delete()
    //   .eq('id', id);
    // if (dbError) {
    //   throw dbError;
    // }
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

export const updateData = async (id: string, updates: Partial<API.UserData>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw error;
  }
};
