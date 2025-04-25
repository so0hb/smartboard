declare namespace PublicApp {

    type Theme = 'light' | 'dark' | 'auto'

     type Language = 'zh-CN' | 'ar-DZ' | 'zh-TW' | 'en-US' | 'ko-KR' | 'ru-RU'
    


interface SettingsLinks{
    googlPlay?: string; 
    applestore?: string;
    facebook?: string;
    youtube?: string;
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    privacyPolicy: string;
    termsOfUse: string;
  }
  
  interface AuthOption {
    email: boolean;            // Is email authentication enabled?
    isCode: boolean;           // Is code-based authentication enabled?
    google: boolean;           // Is Google authentication enabled?
    facebook: boolean;         // Is Facebook authentication enabled?
  }
  
  interface ApplicationSettings{
    nameApp: string;           // Name of the app
    logoUrl: string;   
    defaultTheme: Theme;       // Default theme settings
    defaultLanguage: Language;  // Default language settings
    authOption: AuthOption; // Authentication options
    links:SettingsLinks
    version?: string;          // Application version
  



    systemMessage: string
    temperature: number
    top_p: number
    isEmojis?:boolean

        // Metadata
createdAt: string;         // Creation timestamp
updatedAt: string;         // Last updated timestamp
  }
  interface DashboardOption {
    id: string;                // Unique identifier for the app/dashboard
    theme: Theme
    language: Language
    emailsSupport: string;    // Support email addresses
    emailDeveloper?: string; // Developers' email addresses (optional)
    phoneNumber?: string;    // Contact phone numbers (optional)
  
    // UI settings
    isModelAction: boolean;    // Indicates if model actions are enabled
    labelPlacement: string;     // Label placement strategy (e.g., top, left)
    span: number;               // Span for layout (e.g., grid span)
    columnGrid: number;         // Number of columns in the grid layout
  
    applicationSettings:ApplicationSettings
  

  }
  

    type AppSetting = {
     id:string
     defaultAiModel: API.ModelAI
     defaultMessage: string
     termsOfUseUrl: string
     privacyPolicyUrl: string
     urlGooglplay?: string; 
     urlAppstore?: string;
     urlFacebook?: string;
     urlYoutube?: string;
     urlWhatsapp?: string;
     email?: string;
     urlInstagram?: string;
     urlTiktok?: string;
     phoneNumber?: string;
     version?: string; 
     createdAt: string
     updatedAt: string
    }






    type TypeService = "text" | "image" | "research" | "video" | "audio" | 'AI' ;
    type TypeServiceText = "research" | "present" | "cv";
    type TypeAdded = 'default' | 'personal';
    type STATE = 'Running' | 'Busy' | 'Stopped' | 'Unknown';



    type PublicAttribute = {
        id?: number
        createdAt: Date
        updatedAt: Date
    }


    type Provider = PublicAttribute & {
        name: string;
        description: string;
        providerType: string;
        isActive: boolean;
        state: "Pending" | "Stop" | "Running";
        priority: number;
        isMessageSystem: boolean;
        isArabic: boolean;
        isAuth: boolean;
        isCookies: boolean;
        isStream: boolean;
        isParameter: boolean;
    };

    type CompanyAI = PublicAttribute & {
        name: string;
        label: string;
        isActive: boolean;

        description: string;
        url: string;
    };

    type Character = PublicAttribute & {
        userId: string;
        name: string;
        isActive: boolean;
        typeAdded: TypeAdded;
    };

    type Prompt = PublicAttribute & {
        characterId: number;
        userId: string;
        text: string;
        isActive: boolean;

    };

    type MessageUser = PublicAttribute & {
        text: string
        convId?: string
        inversion?: boolean
    }

    type ReplyMessage = PublicAttribute & {
        text: string
        error: boolean
        loading: boolean
        isLike: null | boolean
        conversationOptions?: Chat.ChatTextRequest | null
        requestOptions: { prompt: string; options?: Chat.ChatTextRequest | null }
        inversion?: boolean
    }

    type ReplyImage = PublicAttribute & {
        images: [string]
        error: boolean
        loading: boolean
        isLike: null | boolean
        inversion?: boolean
    }

    type Chat = {
        messageUser: MessageUser
        replyAi: ReplyMessage[] | ReplyImage[]
    }

    type Conversation = {
        id?: string
        title: string
        model?: Model
        listChat: Chat[]
        isEdit: boolean
        isPin: boolean
        isFavorite: boolean
        isLike: null | boolean
        createdAt: Date
        updatedAt: Date
        userId?: string
    }

    type resConversation = {
        id: string
        title: string
        model: Model
        listChat: Chat[]
        isEdit: boolean
        isPin: boolean
        isFavorite: boolean
        isLike: null | boolean
        createdAt: Date
        updatedAt: Date
        userId?: string
    }





    interface ThemeVars {
        fontFamily: string;
        fontFamilyMono: string;
        fontWeight: string;
        fontWeightStrong: string;
        cubicBezierEaseInOut: string;
        cubicBezierEaseOut: string;
        cubicBezierEaseIn: string;
        borderRadius: string;
        borderRadiusSmall: string;
        fontSize: string;
        fontSizeMini: string;
        fontSizeTiny: string;
        fontSizeSmall: string;
        fontSizeMedium: string;
        fontSizeLarge: string;
        fontSizeHuge: string;
        lineHeight: string;
        heightMini: string;
        heightTiny: string;
        heightSmall: string;
        heightMedium: string;
        heightLarge: string;
        heightHuge: string;
        baseColor: string;
        primaryColor: string;
        primaryColorHover: string;
        primaryColorPressed: string;
        primaryColorSuppl: string;
        infoColor: string;
        infoColorHover: string;
        infoColorPressed: string;
        infoColorSuppl: string;
        successColor: string;
        successColorHover: string;
        successColorPressed: string;
        successColorSuppl: string;
        warningColor: string;
        warningColorHover: string;
        warningColorPressed: string;
        warningColorSuppl: string;
        errorColor: string;
        errorColorHover: string;
        errorColorPressed: string;
        errorColorSuppl: string;
        textColorBase: string;
        textColor1: string;
        textColor2: string;
        textColor3: string;
        textColorDisabled: string;
        placeholderColor: string;
        placeholderColorDisabled: string;
        iconColor: string;
        iconColorHover: string;
        iconColorPressed: string;
        iconColorDisabled: string;
        opacity1: string;
        opacity2: string;
        opacity3: string;
        opacity4: string;
        opacity5: string;
        dividerColor: string;
        borderColor: string;
        closeIconColor: string;
        closeIconColorHover: string;
        closeIconColorPressed: string;
        closeColorHover: string;
        closeColorPressed: string;
        clearColor: string;
        clearColorHover: string;
        clearColorPressed: string;
        scrollbarColor: string;
        scrollbarColorHover: string;
        scrollbarWidth: string;
        scrollbarHeight: string;
        scrollbarBorderRadius: string;
        progressRailColor: string;
        railColor: string;
        popoverColor: string;
        tableColor: string;
        cardColor: string;
        modalColor: string;
        bodyColor: string;
        tagColor: string;
        avatarColor: string;
        invertedColor: string;
        inputColor: string;
        codeColor: string;
        tabColor: string;
        actionColor: string;
        tableHeaderColor: string;
        hoverColor: string;
        tableColorHover: string;
        tableColorStriped: string;
        pressedColor: string;
        opacityDisabled: string;
        inputColorDisabled: string;
        buttonColor2: string;
        buttonColor2Hover: string;
        buttonColor2Pressed: string;
        boxShadow1: string;
        boxShadow2: string;
        boxShadow3: string;
      }
}

declare namespace companyAi {
    type companyAi = PublicApp.PublicAttribute & {
        providerId: number;
        companyAiId: number;
        name: string;
        label: string;
        type: TypeService;
        isActive: boolean;
        state: "Pending" | "Stop" | "Running";
        description: string;
    }

}


declare namespace Model {
    type Model = PublicApp.PublicAttribute & {
        providerId?: number;
        companyAiLabel: string;
        name: string;
        label: string;
        type: TypeService;
        isActive: boolean;
        state: "Pending" | "Stop" | "Running";
        description: string;
    }

    type ResModel = {
        companyAiLabel: string;
        name: string;
        label: string;
        type: TypeService;
        isActive: boolean;
        state: "Pending" | "Stop" | "Running";
    }


}
declare namespace Conv {

    type reqConv = {
        id: string
        userId: string
    }
 
    type resConv = {
        id: string //uuid example (dcb2d2ae-4039-4172-a347-7d324337eca8)
        title: string
        isEdit: boolean
        isPin: boolean
        isFavorite: boolean
        isLike: null | boolean
        createdAt: Date
        updatedAt: Date
        userId: string  //uuid example (dcb2d2ae-4039-4172-a347-7d324337eca8)
        type: "text" | "image";
        model: {
            id: number
            name: string;
            label: string;
            type: "text" | "image";
            isActive: boolean;
            state: "Pending" | "Stop" | "Running";
            provider?: {
                id: number
                name: string;
                providerType: string;
                isActive: boolean;
                state: "Pending" | "Stop" | "Running";
                isMessageSystem: boolean;
                isArabic: boolean;
                isAuth: boolean;
                isCookies: boolean;
                isStream: boolean;
                isParameter: boolean;
            }
            companyAi?: {
                id: number;
                name: string;
                label: string;
                isActive: boolean;
            }
        }
        chat: {
            textChat: [
                messageUser: {
                    id: number
                    text: string
                    createdAt: Date
                    updatedAt: Date
                    inversion: boolean
                },
                messageAI: [{
                    id: number
                    text: string
                    inversion: boolean
                    error: boolean
                    loading: boolean
                    isLike: null | boolean
                    conversationOptions?: {
                        conversationId?: string
                        parentMessageId?: string
                    } | null
                    requestOptions: {
                        prompt: string; options?: {
                            conversationId?: string
                            parentMessageId?: string
                        } | null
                    }

                    createdAt: Date
                    updatedAt: Date
                }]

            ] | null,
            imageChat: [
                messageUser: {
                    id: number
                    text: string
                    inversion: boolean
                    createdAt: Date
                    updatedAt: Date
                },
                messageAI: [{
                    id: number
                    images: [string]
                    inversion: boolean
                    error: boolean
                    loading: boolean
                    isLike: null | boolean
                    createdAt: Date
                    updatedAt: Date
                }
                ]
            ] | null
        }
    }




  
}