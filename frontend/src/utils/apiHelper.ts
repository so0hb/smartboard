import { camelToSnake, snakeToCamel } from '@/utils/functions';
import {get, post, put, del} from '@/utils/request/index'
// Utility function to fetch data from a table
export const fetchDataFromTable = async <T>(
  tableName: string,
  limit: number,
  offset: number,
  filters?: { [key: string]: any } 
): Promise<{ data: T[]; totalCount: number }> => {
  try {

    let response = await get<T>({
        url: tableName,
       method : 'GET'
      });
      console.log(response)

    const data  =  response.results
 const count = response.count;
    const camelData = data?.map(snakeToCamel) || [];
    console.log(camelData)
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
    // Convert camelCase data to snake_case
    const snakeData = [dataInserted as any].map(camelToSnake);

    console.log("Inserting data into table:", tableName, snakeData);

     await post<T>({
      url: tableName,
      method: 'POST',
      data: snakeData[0],
    });
    const camelData = [snakeData[0]].map(snakeToCamel);

    return camelData[0] as T;
  } catch (error: any) {
    console.error("Error inserting data:", error);
    throw new Error(error.message || 'Failed to insert data into table');
  }
};

// Utility function to delete data from a table
export const deleteDataFromTable = async (tableName: string, id: string): Promise<void> => {
  try {
    console.log(`Deleting data from ${tableName}, ID: ${id}`);
    await del({
      url: `${tableName}/${id}/`, 
      method: 'DELETE',
    });
    console.log(`Data deleted successfully from ${tableName}`);
  } catch (error: any) {
    console.error(`Error deleting data from ${tableName}, ID: ${id}:`, error.message);
    throw new Error(error.message || 'Failed to delete data from table');
  }
};

// Utility function to update data in a table
export const updateDataInTable = async <T>(
  tableName: string,
  data: T
): Promise<T> => {
  try {
    // Convert camelCase data to snake_case
    const snakeData = camelToSnake(data);

    console.log(`Updating data in ${tableName}`, snakeData);

    const response = await put<T>({
      url: `${tableName}/${(data as any).id}`, // Assuming the ID is part of the data object
      method: 'PUT',
      data: snakeData,
    });

    // Convert the response back to camelCase
    const updatedData = snakeToCamel(response);

    console.log(`Data updated successfully in ${tableName}`);
    return updatedData as T;
  } catch (error: any) {
    console.error(`Error updating data in ${tableName}:`, error.message);
    throw new Error(error.message || 'Failed to update data in table');
  }
};

// // Utility function to get image URL from Supabase
export const getImageUrl = async (bucket: string, imageName: string): Promise<string> => {
  try {
    // const { data } = supabase
    //   .storage
    //   .from(bucket)
    //   .getPublicUrl(imageName);
    return 'data.publicUrl';
  } catch (error: any) {
    console.error('Error fetching image URL:', error.message);
    throw error;
  }
};
