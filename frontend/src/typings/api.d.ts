declare namespace API {
  type Roles  =  'admin' | 'student' | 'instructor';

  interface CurrentUser  {
    id: string
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username: string| null,
    role: Roles| null
  }
  interface Question {
    id: string
    title: string
    content: string
    category: string
    createdAt: string
    updatedAt: string
    userId: string
    files: File[]
  }
  
   interface QuestionMedia {
    id: string
    questionId: string
    file: string
    fileType: string
    createdAt: string
  }
  
   interface Answer {
    id: string
    content: string
    questionId: string
    userId: string
    createdAt: string
    updatedAt: string
  }

  type inputOutputData = 'Text' | 'Image' | 'Audio' | 'Video' | 'Documents'


  type userGender  = 'male' | 'female' | 'other';


  interface UserData {
    id: string | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    avatarUrl: string | null;

    dateOfBirth: string | null;
    state: boolean | null;
    gender: Gender | null;
    role: UserType | null;
    country: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

interface User {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
}


interface UserAuth {
    username: string | null;
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    reenteredPassword?: string
    role: UserType | null;
}

  interface UserMetaData{
    avatar: string
    fristName: string
    description?: string
    lastName?: string;
    avatarUrl?: string;
    dateOfBirth?: string; 
    state?: boolean;
    gender?: userGender
    userType?:Roles
    country?: string;
    email?:string
    password?:string
    createdAt?: string; 
    updatedAt?: string; 
  }

  interface CompanyAI {
    id?: string; 
    name: string;
    apiUrl: string;
    apiKey: string;
    companyUrl?: string;
    logoUrl?: string;

    isActivate: boolean;
    createdAt: string;
    updatedAt: string;
  }


  interface DashboardState {
    clientCount: number
    expertCount: number
    adminCount: number
    aiCompanyCount: number
    aiModelCount: number
    questionCount: number
    convAICount: number
    convExpertCount: number
    monthlyData: MonthlyData[]
    monthlyDataLoading: boolean
  }

  interface ModelAI {
    id?: string;
    companyId: string;
    name: string;
    modelCode: string;
    description?: string;
    isActivate: boolean;
    version?: string;
    createdAt: string;
    updatedAt: string;
    inputData?: inputOutputData[];
    outputData?: inputOutputData[];
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    repetitionPenalty?: number;
    stop?: string[];
    stream?: boolean;
  }


  interface Dashboard {
    clientCount: number;
    expertCount: number;
    adminCount: number;
    aiCompanyCount: number;
    aiModelCount: number;
    questionCount: number;
  }


  interface Country {
    id?: string; // optional unique identifier
    name: string;
    alpha_2: string; // 2-character country code
    alpha_3: string; // 3-character country code
    countryCode: string; // numeric country code
    iso_31662?: string; // optional ISO 3166-2 code
    region: string;
    subRegion: string;
    intermediateRegion?: string; // optional intermediate region
    regionCode: string;
    subRegionCode: string;
    intermediateRegionCode?: string; // optional intermediate region code
    isActivate: boolean;
    createdAt: string;
    updatedAt: string;
  }
}
