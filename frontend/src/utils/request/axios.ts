import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'
import applyCaseMiddleware from 'axios-case-converter';
export const baseURL = import.meta.env.VITE_GLOB_API_URL + import.meta.env.VITE_APP_API_BASE_URL; 
const service = applyCaseMiddleware(axios.create({
  baseURL:baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
}))

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200 || response.status === 201 || response.status === 204)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
