import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { download, get, post } from '@/utils/request'
import { useAuthStore, useSettingStore , useChatStore , useUserStore} from '@/store'


export function fetchChatAPI1<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {

  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess1<T = any>(
  params: {
    conversation_id:number
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()
  const chatStore = useChatStore()
//  terminal.log("chatStore====>", chatStore)

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }
  
  const userStore = useUserStore()
  const user_id = userStore.userInfo.user?.id

  if (authStore.isChatGPTAPI ) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
      api:"chatgptAPI",
      user_id: user_id,
      conversation_id:params.conversation_id,
   
     
    }
  } else if (authStore.isAlharaqApi){
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      api:"AlharaqApi",
      model:chatStore.currentModel.modelValue,
      user_id: user_id,
  
      conversation_id:params.conversation_id,

    }
  }

  const response = post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })

 return response

}

export function fetchSupportModels<T>(){
  return get<T>({
    url: '/models',
  })
}



export function convertMarkdown<T = any>( chat_id: string, outputFormat: string) {
  const userStore = useUserStore()
  const user_id = userStore.userInfo.user?.id
 
  // return post<T>({
  //   url: '/convert', // Adjust the endpoint accordingly
  //   data: { user_id , chat_id, outputFormat },
  // });
  return download<T>({
    url: '/convert',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      user_id: user_id,
      chat_id: chat_id,
      outputFormat: outputFormat,
    },
  });
}


export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })

}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
