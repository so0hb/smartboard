import { ss } from '@/utils/storage'
const LOCAL_NAME_TEXT = 'chatStorageText';
const LOCAL_NAME_IMAGE = 'chatStorageImage';
import { useUserStore } from '@/store';

// export const defaultModelText: Chat.ModelAI = {
//   code: "gpt-4",
//   companyAi: {
//     id: 1,
//     name: "Open ai",
//     label: "Open Ai",
//     isActive: true,
//     description: "",
//     imgUrl: "",
//     websiteUrl: "",
//     createdAt: "2024-01-13T14:47:13.055778Z",
//     updatedAt: "2024-01-13T14:47:13.055837Z",
//   },
//   // api_owner: {
//   //   code: "gpt4all",
//   //   api_options: [],
//   //   type_service: "text",
//   //   type_price: "free",
//   //   label: "Gpt 4 all",
//   //   is_active: true,
//   //   state: "Running",
//   //   notes: "",
//   //   version: "",
//   //   created_at: "2024-01-13T14:54:37.965633Z",
//   //   updated_at: "2024-01-13T14:54:37.965711Z",
//   //   api_options_id: [],
//   // },
//   label: "Gpt 4",
//   typeService: "text",
//   isActive: true,
//   isStream: true,
//   isWebSearch:true,
//   isAllowImage:true,
//   state: "Running",
//   description: "",
//   createdAt: "2024-01-13T14:55:06.826941Z",
//   updatedAt: "2024-01-13T14:55:06.827002Z",
//   // api_owner_id: "gpt4all",
//   // provider: [],
//   languages: ["ar", "en"],
// };


export const defaultModelText: Chat.ModelAI = {
  code: "llama2-70b",
  companyAi: {
    id: 1,
    name: "LLama2",
    label: "Meta",
    isActive: true,
    description: "",
    imgUrl: "",
    websiteUrl: "",
    createdAt: "2024-01-13T14:47:13.055778Z",
    updatedAt: "2024-01-13T14:47:13.055837Z",
  },
  // api_owner: {
  //   code: "gpt4all",
  //   api_options: [],
  //   type_service: "text",
  //   type_price: "free",
  //   label: "Gpt 4 all",
  //   is_active: true,
  //   state: "Running",
  //   notes: "",
  //   version: "",
  //   created_at: "2024-01-13T14:54:37.965633Z",
  //   updated_at: "2024-01-13T14:54:37.965711Z",
  //   api_options_id: [],
  // },
  label: "LLama2",
  typeService: "text",
  isActive: true,
  isStream: true,
  isWebSearch:false,
  isAllowImage:false,
  state: "Running",
  description: "",
  createdAt: "2024-01-13T14:55:06.826941Z",
  updatedAt: "2024-01-13T14:55:06.827002Z",
  // api_owner_id: "gpt4all",
  // provider: [],
  languages: ["en"],
};

export const defaultModelImage: Chat.ModelAI = {
  code: "SSD-1B",
  companyAi: {
    id: 1,
    name: "Open ai",
    label: "Open Ai",
    isActive: true,
    description: "",
    imgUrl: "",
    websiteUrl: "",
    createdAt: "2024-01-13T14:47:13.055778Z",
    updatedAt: "2024-01-13T14:47:13.055837Z",
  },
  // api_owner: {
  //   code: "gpt4all",
  //   api_options: [],
  //   type_service: "text",
  //   type_price: "free",
  //   label: "Gpt 4 all",
  //   is_active: true,
  //   state: "Running",
  //   notes: "",
  //   version: "",
  //   created_at: "2024-01-13T14:54:37.965633Z",
  //   updated_at: "2024-01-13T14:54:37.965711Z",
  //   api_options_id: [],
  // },
  label: "SSD 1B",
  typeService: "image",
  isActive: true,
  isStream: true,
  isWebSearch:false,
  isAllowImage:false,
  state: "Running",
  description: "",
  createdAt: "2024-01-13T14:55:06.826941Z",
  updatedAt: "2024-01-13T14:55:06.827002Z",
  // api_owner_id: "gpt4all",
  // provider: [],
  languages: ["en"],
};
export function defaultCurrentConversation(type:PublicApp.TypeService= 'text'): Chat.ResConv {
  const userStore = useUserStore();
  const userId: string = userStore.userInfo!.user!.id!;
  const localState: Chat.ChatState | undefined = getLocalState(type);
  console.log("localState", localState);
  const defaultModel =
    (localState?.currentConversation?.type === "text" || localState?.currentConversation?.type === "research")
      ? defaultModelText
      : localState?.currentConversation?.type === "image"
      ? defaultModelImage
      : defaultModelText; // You can set a default model as needed

  const init: Chat.ResConv = {
    id: "",
    title: "",
    lang: localState?.currentConversation?.lang ?? "en",
    isEdit: false,
    isPin: false,
    isFavorite: false,
    isLike: null,
    type: localState?.currentConversation?.type ?? "text",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: userId,
    modelInfo: localState?.currentConversation?.modelInfo ?? defaultModel,
    isOptionSelectEnable: false,
    chat: [],
  };

  return init;
}



export function defaultState(): Chat.ChatState {

  return {
    listConversation: [],
    currentConversation: defaultCurrentConversation(),
    listModel: [],
    isShowSelect: true,
    loadingConversationsText: false,
    loadingChat: false,
    loadingConversationsImage: false,
    loadingConversationsResearch: false,
    loadingMessage: false,
    isErrorResponse: false,
    currentPromptUser:'',
    loadingCon:{
      text: false,
      image: false,
      research: false,
      "Agri-Expert": false,
      video: false,
      audio: false,
      AI: false
    },
    itemCount:{
      text: 0,
      image: 0,
      research: 0,
      "Agri-Expert": 0,
      video: 0,
      audio: 0,
      AI: 0
    },
    lengthListChatText:0,
    lengthListChatImage:0,
    lengthListChatResearch:0,
    controller: new AbortController(),
  }
}

export function getLocalState(type: PublicApp.TypeService): Chat.ChatState | undefined {
  const localName = type === 'image'  ? LOCAL_NAME_IMAGE  : LOCAL_NAME_TEXT;
  const localState: Chat.ChatState | undefined = ss.get(localName);
  return localState;
}

export function setLocalState(type: PublicApp.TypeService, state: Chat.ChatState) {
  const localName = type === 'image'  ? LOCAL_NAME_IMAGE : LOCAL_NAME_TEXT ;
  ss.set(localName, state);
}

