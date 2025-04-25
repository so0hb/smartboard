import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import {  post } from '@/utils/request'
import { useAuthStore, useSettingStore , useChatStore , useUserStore} from '@/store'


interface FetchChatParams {
  conversation_id: string;
  options?: { conversationId?: string; parentMessageId?: string };
  prompt: string;
  signal?: GenericAbortSignal;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function fetchChatAPIProcess<T = any>(params: FetchChatParams) {
  return fetchChatProcess<T>('/chat/text', params);
}

export async function fetchChatImageGenAPIProcess<T = any>(params: FetchChatParams) {
  return fetchChatProcess<T>('/chat/image', params);
}

async function fetchChatProcess<T = any>(url: string, params: FetchChatParams) {
  const settingStore = useSettingStore();
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const userId = userStore.userInfo.user?.id;

  // Check if conversation_id is an empty string and set it to null
  const conversationId = params.conversation_id.trim() === '' ? null : params.conversation_id;
console.log("model")
  const data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
    systemMessage: settingStore.systemMessage,
    apiOwner: 'AlharaqApi',
    temperature: settingStore.temperature,
    top_p: settingStore.top_p,
    model: chatStore.currentConversation.modelInfo?.code,
    userId: userId,
    conversationId: conversationId,
  };

  return post<T>({
    url: url,
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  });
}
