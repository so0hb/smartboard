import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store/helper'
// import { fetchSession } from '@/api'
import { supabase } from '@/utils/supabase'
import { AuthError, Session, User } from '@supabase/supabase-js'
import { useUserStore, useChatStore, useUsersStore } from '@/store'
import { get, post, del } from '@/utils/request'
import { camelToSnake, snakeToCamel } from '@/utils/functions'
export interface AuthState {
  token: string | undefined
  error: AuthError | null;
  userAuth: API.UserAuth
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    error: null,
    userAuth: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      reenteredPassword: '',
      username: null,
      role: null
    },
  }),

  getters: {

  },

  actions: {

    async signUp(userData: API.UserAuth, type?:string): Promise<void> {
      try {
        if (!userData.username  || !userData.email || !userData.password || !userData.password) {
          throw new Error('Email, password, and password confirmation are required');
        }

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

        if (data && !type) {
          console.log('User logged in successfully:', data);
          setToken(data.token);
          const userStore = useUserStore();
          userStore.updateUserState({ user: data.user, session: data.session });
          this.error = null;
        }
        console.log('User registered successfully:', data);
        this.error = null;
      } catch (error) {
        this.error = error as AuthError;
        throw error;
      }
    },

    async Login(username: string, password: string): Promise<void> {
      try {
        const { data, error } = await post({
          url: 'users/login/',
          data: { username, password },
          method: 'POST',
        });

        if (error) {
          throw error;
        }

        if (data) {
          console.log('User logged in successfully:', data);
          setToken(data.token);
          const userStore = useUserStore();
          userStore.updateUserState({ user: data.user, session: data.session });
          this.error = null;
        }
      } catch (error) {
        this.error = error as AuthError;
        throw error;
      }
    },
  

    async verifyOTP(email: string, token: string): Promise<void> {
      try {
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

        if (error) {
          throw error;
        }

        console.log("data:", data)
        console.log("data:", data)
        const userStore = useUserStore()
        userStore.updateUserState({ user: data.user, session: data.session })

        this.error = null;
      } catch (error) {
        this.error = error as AuthError;
        throw error;
      }
    },

    async reSendVerifyOTP(email: string, type: "signup" | "email_change" = "signup"): Promise<void> {
      try {
        const { data, error } = await supabase.auth.resend({
          type: type,
          email: email,
        })
        if (error) {
          throw error;
        }

        if (data) {

          // const userStore = useUserStore()
          // userStore.updateUserInfo({ user: data.user, session: data.session })

          // this.error = null;
        }

      } catch (error) {
        this.error = error as AuthError;
        throw error;
      }
    },




    async signOut(): Promise<void> {
      try {
        // const { error } = await supabase.auth.signOut();

        // if (error) {
        //   throw error;
        // }
        const userStore = useUserStore()
        // const chatStore = useChatStore()
        userStore.resetUserState()
        // chatStore.resetChatState()
      } catch (error) {
        this.error = error as AuthError;
        throw error;
      }
    },

    async refreshToken() {

      const userStore = useUserStore();
      const refreshToken = userStore.session?.access_token;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

      if (error) {
        throw new Error('Unable to refresh token');
      }


      userStore.updateUserState({ user: data.user, session: data.session })

    },
    isAuthenticated(): boolean {
      const userStore = useUserStore()
      console.log("userStore.user", userStore.user)
      return userStore.user !== null 
      //&& userStore.session !== null;
    },
    isAdmin(): boolean {
      const userStore = useUserStore()
      return userStore.user?.role === 'admin'
      //&& userStore.session !== null;
    },

    // async getSession() {
    //   try {
    //     const { data, error } = await supabase.auth.getSession();

    //     if (error) {
    //       // Handle any errors
    //       return Promise.reject(error.message);
    //     }

    //     this.session = { auth:data !== null, model: 'AlharaqApi' }; 
    //     return Promise.resolve(this.session);
    //   } catch (error) {
    //     return Promise.reject(error);
    //   }
    // },


    // async getSession() {

    //   try {
    //     const { data } = await fetchSession<SessionResponse>()

    //     this.session = { ...data }
    //     return Promise.resolve(data)
    //   }
    //   catch (error) {
    //     return Promise.reject(error)
    //   }
    // },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
