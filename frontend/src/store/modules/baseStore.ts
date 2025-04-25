import { deleteDataFromTable, fetchDataFromTable, insertDataIntoTable, updateDataInTable } from '@/utils/supabaseHelper';
import { defineStore } from 'pinia';

// Create a generic base store
export function createBaseStore<T>(tableName: string, initState: () => T, bucket="") {
  return defineStore(`${tableName}-store`, {
    state: () => ({
      listData: [] as T[],
      loadingInit: true,
      showAdd: false,
      showUpdate: false,
      countTotalData: 0,
      bucket:bucket ?? tableName
    }),
    actions: {
            initState(): T {
      return initState();
    },
      async fetchDataAction({ limit, offset, filters }: { limit: number; offset: number; filters?: Record<string, any> }): Promise<void> {
        try {
          const { data, totalCount } = await fetchDataFromTable<T>(tableName, limit, offset, filters);
          this.listData = data;
          this.countTotalData = totalCount;
        } catch (error: any) {
          console.error(`Error fetching data from ${tableName}:`, error.message);
          throw error;
        }
      },

      async insertDataAction(newData: T): Promise<void> {
        try {
          const insertedData = await insertDataIntoTable<T>(tableName, newData);
          this.listData = [insertedData, ...this.listData];
          this.countTotalData += 1;
        } catch (error: any) {
          console.error(`Error inserting data into ${tableName}:`, error.message);
          throw error;
        }
      },

      async deleteDataAction(id: string): Promise<void> {
        try {
          await deleteDataFromTable(tableName, id);
          this.listData = this.listData.filter(item => item.id !== id);
          this.countTotalData -= 1;
        } catch (error: any) {
          console.error(`Error deleting data from ${tableName}:`, error.message);
          throw error;
        }
      },

      async updateDataAction(data: T): Promise<void> {
        try {
          await updateDataInTable<T>(tableName, data);
          this.listData = this.listData.map(item =>
            item.id === data.id ? { ...item, ...data } : item
          );
        } catch (error: any) {
          console.error(`Error updating data in ${tableName}:`, error.message);
          throw error;
        }
      }
    }
  });
}
