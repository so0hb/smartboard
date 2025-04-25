
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore, useChatStore, useUserStore } from '@/store'
interface FetchChatParams {
  conversation_id: string;
  parentMessageId?: string;
  isWebSearch?: boolean;
  image?: string;
  options?: { conversationId?: string; parentMessageId?: string };
  prompt: string;
  type: PublicApp.TypeService
  signal?: GenericAbortSignal;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export async function fetchChatProcess<T = any>(params: FetchChatParams) {
  const settingStore = useSettingStore();
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const userId = userStore.userInfo.user?.id;

  // Check if conversation_id is an empty string and set it to null
  const conversationId = params.conversation_id.trim() === '' ? null : params.conversation_id;

  const data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
    parentMessageId: params.parentMessageId,
    systemMessage: settingStore.systemMessage,
    apiOwner: 'AlharaqApi',
    temperature: settingStore.temperature,
    top_p: settingStore.top_p,
    model: chatStore.currentConversation.modelInfo?.code,
    lang: 'ar',//chatStore.currentConversation.lang,
    userId: userId,
    conversationId: conversationId,
    isWebSearch: params.isWebSearch,
    image: params.image,
    isEmojis: settingStore.isEmojis
  };
  let url = ""
  if (params.type === 'image') {
    url = '/chat/image'
  } else if (params.type === 'research') {
    url = '/chat/research';
  } else {
    url = '/chat/text';
  }

  console.log("url", url)
  return post<T>({
    url: url,
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  });
}