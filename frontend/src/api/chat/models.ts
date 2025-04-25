import type {  GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'
import { useAuthStore, useSettingStore , useChatStore , useUserStore} from '@/store'



export  async function fetchListModelsAI<T = any>() {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()
  const chatStore = useChatStore()

  const userStore = useUserStore()
  const user_id = userStore.userInfo.user?.id
  const data = {
    is_active: 1,
    state: "Running",
};

 
  const response = await get<T>({
    url: 'listmodels/',
    data,
  })

  console.log("=============response", response)
 return response

}

