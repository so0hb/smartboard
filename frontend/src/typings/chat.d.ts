declare namespace Chat {
  //   listModel: Model.ResModel[]

  type Media = {
    id?: string;
    mediaUrl?: string;
    mediaType?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type QuestionMedia = Media & {
    questionId?: string;
  };

  type AnswerMedia = Media & {
    answerId?: string;
  };
  type CountTotal = {
    countTotalData
  }
  type ChatState = {
    listConversation: ResConv[]
    currentConversation: ResConv
    loadingConversationsText: boolean
    loadingChat: boolean
    loadingConversationsImage:boolean
    loadingConversationsResearch:boolean
    isShowSelect: boolean
    loadingMessage: boolean
    isErrorResponse: boolean
    listModel: ModelAI[]
    currentPromptUser:string
    loadingCon: {
      [K in PublicApp.TypeService]: boolean;
    };
    itemCount: {
      [K in PublicApp.TypeService]: number;
    };
    lengthListChatText:number
    lengthListChatImage:number
    lengthListChatResearch:number
    controller: AbortController;
  }





  type ReqConv = {
    id: string
    userId: string
  }

  type TextWithTran = {
    id?: string;
    text: string;
    code: string
    provider?: string
    createdAt?:string;
    updatedAt?: string;
  }
  type GeneralApiResponsePaginate<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  };
  type MessageUser = {
    id?: string;
    text: string;
    imagePath?: string
    textTranInfo?:TextWithTran[]
    createdAt?: string;
    updatedAt?: string;
    inversion?: boolean;
    questionMedia?:QuestionMedia[]
  };

  type MessageAI = {
    id?: string;
    text: string;
    textTranInfo?:TextWithTran[]
    imagePath?: string
    inversion?: boolean;
    error?: boolean;
    loading?: boolean;
    isLike: null | boolean;
    parentMessageId?: string;
    createdAt?:string;
    updatedAt?: string;
    isShowOrignalText?:boolean
    answerMedia:AnswerMedia[]
  };



  type Item = { messageUser: MessageUser; messageAi: MessageAI[], currentIndex: number }


  type ResChatText = {
    conversation:Partial<ResConv>
    messageUser:Partial<MessageUser>
    messageAi: Partial<MessageAi> | [Partial<MessageAi>]
  }
  type ResConv = {
    id: string;
    title: string;
    lang: string
    isEdit: boolean;
    isPin: boolean;
    isFavorite: boolean;
    isLike: null | boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
    modelInfo: ModelAI;
    type: PublicApp.TypeService
    chat: Item[];
    isOptionSelectEnable: boolean
    userData?: User.UserData;
  };



  type CompanyAI = {
    id: number;
    name: string;
    label: string;
    isActive: boolean;
    description?: string;
    imgUrl?: string;
    websiteUrl?: string;
    createdAt: string;
    updatedAt: string;
  }

  type ModelAI = {
    code: string;
    // provider: Provider[];
    companyAi: CompanyAI
    // api_owner: ApiOwner;
    label: string;
    typeService: PublicApp.TypeService
    languages: string[];
    isActive: boolean;
    isStream: boolean;
    isWebSearch?: boolean;
    isAllowImage?: boolean;
    state: PublicApp.STATE
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  };





  // type ResGenImage = {
  //   id: number
  //   images: [string]
  //   isLike: null | boolean
  //   createdAt: Date
  //   updatedAt: Date
  // }
}

