// index.ts

import { defineStore } from 'pinia';
import {
  fetchData, deleteData, updateData, insertData
} from './helper';
import { useUserStore } from '@/store';
import { fetchDataFromTable, getImageUrl, updateDataInTable , deleteDataFromTable} from '@/utils/apiHelper';
import post from '@/utils/request';
import { camelToSnake } from '@/utils/functions';
export function initState(): API.UserData {
  const userStore = useUserStore()
  // const user_id: string = userStore.userInfo!.user!.id!;
  return {
    id: '',
    username:"",
    firstName: "",
    lastName: "",
    email: null,
    password: null,
    avatarUrl: "https://example.com/avatar.jpg",
    dateOfBirth: "1990-01-01",
    state: true,
    gender: "male",
    role: "student",
    country: "USA",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"

  }
}
const tableName = '/users/users';

export const useUsersStore = defineStore('users-store', {
  state: () => ({
    listUsers: [] as API.UserData[],
    usersInfo: initState(),
    loadingInit: false,
    showList:true,
    showAdd: false,
    showUpdate: false,
    countTotalData: 0,
    bucket: 'company'
  }),
  actions: {
    initState(): API.UserData {
      const userStore = useUserStore()
      // const user_id: string = userStore.userInfo!.user!.id!;
      return {

        id: '',
        username:"",
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        avatarUrl: "",
        dateOfBirth: "",
        state: true,
        gender: "male",
        role: "client",
        country: "USA",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      }
    },

    async fetchDataAction({ limit, offset, userType }: { limit: number; offset: number, userType: string }): Promise<void> {
      try {
        // const userStore = useUserStore()
        // const user_id: string = userStore.userInfo!.user!.id!;
        // console.log(userStore.userInfo!.user)
        const { data, totalCount } = await fetchDataFromTable('users/users', limit, offset);
       console.log(data)


        // const { data, totalCount } = await fetchData({ limit: limit, offset: offset, userType: userType });

        const uniqueUsers = data.filter(newUser => !this.listUsers.some(existingUser => existingUser.id === newUser.id));
        this.countTotalData = totalCount;
        this.listUsers = [...this.listUsers, ...uniqueUsers];
        console.log("this.listUsers", this.listUsers)
       
      } catch (error: any) {
        throw error;
      }
    },


    async fetchDataActionById(id:string): Promise<API.UserData> {
      try {
        const filters = { id: id };
        const { data, totalCount } = await fetchDataFromTable<API.UserData>('users', 1, 0, filters);
        // this.listCompanies = data;


      

        // const uniqueUsers = data.filter(newUser => !this.listUsers.some(existingUser => existingUser.id === newUser.id));
        // this.countTotalData = totalCount;
        // this.listUsers = [...this.listUsers, ...uniqueUsers];
        return data[0];
       
      } catch (error: any) {
        throw error;
      }
    },
    async insertDataAction(userData: API.UserData): Promise<void> {
      try {
        const snakeData = camelToSnake(userData);
        snakeData.password2 = userData.password
        snakeData.role = userData.role || 'student'
        const { data, error } = await post({
          url: 'users/register/',
          data: snakeData,
          method: 'POST',
        });

        if (error) {
          throw error;
        }

        this.listUsers = [data, ...this.listUsers];
      } catch (error: any) {
        throw error;
      }
    },
    async deleteDataAction(id: string): Promise<void> {
      try {
        await deleteDataFromTable('/users' , id);
        const index = this.listUsers.findIndex((university) => university.id === id);
        if (index !== -1) {
          this.listUsers.splice(index, 1);
        }
      } catch (error: any) {
        throw error;
      }
    },

    async updateDataAction(data: API.UserData): Promise<void> {
      try {
        
        await updateDataInTable<API.UserData>(tableName, data);
        if (data.avatarUrl) {
          data.avatarUrl = await getImageUrl(this.bucket, data.avatarUrl);
        }
        this.listUsers = this.listUsers.map(user =>
          user.id === data.id ? { ...user, ...data } : user
        );
      } catch (error: any) {
        console.log(error.message)
        throw error;
      }
    }
   
  },
});
