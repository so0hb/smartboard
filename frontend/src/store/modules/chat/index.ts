import { defineStore } from 'pinia'
import {
  defaultState,
  defaultCurrentConversation,
  setLocalState,
  getLocalState,
  defaultModelText,
  defaultModelImage
} from './helper'
import { router } from '@/router'
import { useUserStore } from '@/store';
import { get, del, put } from '@/utils/request'
import { fetchDataFromTable } from '@/utils/supabaseHelper';
import { supabase } from '@/utils/supabase';
import { snakeToCamel } from '@/utils/functions';
let tableName = 'conversation';
export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => defaultState(),
  getters: {
    getDefaultModel(): Chat.ModelAI {

      const localState: Chat.ChatState | undefined = getLocalState(this.currentConversation.type);

      if (this.currentConversation.type === 'text') {
        if (localState?.currentConversation?.type === "text" && localState?.currentConversation.modelInfo.typeService === "text") {
          return localState?.currentConversation.modelInfo;
        }
        return defaultModelText;
      } else if (this.currentConversation.type === 'research') {
        if (localState?.currentConversation?.type === 'research' && localState?.currentConversation.modelInfo.typeService === 'research') {
          return localState?.currentConversation.modelInfo;
        }
        return defaultModelText;
      }

      else if (this.currentConversation.type === 'image') {

        if (localState?.currentConversation?.type === "image" && localState?.currentConversation.modelInfo.typeService === "image") {

          return localState?.currentConversation.modelInfo;
        }
        return defaultModelImage;
      }

      throw new Error("Unexpected case - no matching type");
    },
    defaultStatueCurrent1() {
      this.currentConversation = defaultCurrentConversation(this.currentConversation.type)
    }


  },
  actions: {

    getConversationById(convId: string) {
      const index = this.listConversation.findIndex((conv) => conv.id === convId);
      const conversation = index !== -1 ? this.listConversation[index] : null;
      return { conversation, index };
    },
    async fetchListModelsAIAction(): Promise<void> {
      try {
        const data = {
          isActive: 1,
          state: "Running",
        };
        const response = await get<Chat.ModelAI[]>({
          url: 'model/',
          data,
        })
        this.listModel = response
      } catch (error: any) {
        console.log("error", error)
        throw error;
      }
    },

    async getListConversationAction({ limit = 20, offset = 1, type = 'AI' }: { limit?: number; offset?: number, type?: PublicApp.TypeService } = {}): Promise<void>  {
      try {

        if (type === 'Agri-Expert'){
          tableName = 'conversation_with_questions'
   
        } 


        const filters = { type: type };
        const { data, totalCount } = await fetchDataFromTable<Chat.ResConv>(tableName, limit, offset, filters);
        const existingIds = new Set(this.listConversation.map(conv => conv.id));

        // Filter new conversations to ensure uniqueness by ID
        const newConvs: Chat.ResConv[] = data
          .filter((item) => !existingIds.has(item.id)) // Keep only items with unique IDs
          .map((item) => ({
            ...item,
            chat: []
          }));
    
        // Update the list of conversations
        this.listConversation = [...this.listConversation, ...newConvs];
        console.log("Updated listConversation", this.listConversation);

        if (type == 'Agri-Expert'){
          this.itemCount['Agri-Expert'] = totalCount;
   
        } else if (type == 'AI'){
          this.itemCount.AI = totalCount;
        }
       
      
      } catch (error: any) {
        console.error('Error fetching models:', error.message);
        throw error;
      }
      // try {
      //   const userStore = useUserStore();
      //   const userId: string = userStore.userInfo!.user!.id!;
      //   const data = {
      //     limit: limit,
      //     offset: offset,
      //     userId: userId,
      //     type: type
      //   };
      
      //   const result = await get<Chat.GeneralApiResponsePaginate<Chat.ResConv>>({
      //     url: 'conversation/',
      //     data
      //   });


      //   const uniqueIds = new Set<string>(this.listConversation.map(item => item.id));
      //   const uniqueResult = result.results.filter(item => !uniqueIds.has(item.id));
      //   this.listConversation = [...this.listConversation, ...uniqueResult];
      //   return result
      // } catch (error: any) {
      //   console.log("error conversation", error);
      //   throw error;
      // }

    },


    async deleteConversationAction(criteria: Partial<Chat.ResConv>): Promise<void> {
      try {
        const userStore = useUserStore();
        const userId: string = userStore.userInfo!.user!.id!;
        criteria.userId = userId;
        const data: any = { userId: criteria.userId };
        if (criteria.id) {
          data.id = criteria.id;
          await del({
            url: `conversation/${criteria.id}`,
            data,
          });


        } else if (criteria.type) {
          data.type = criteria.type;
          await del({
            url: `delete-conversation/${criteria.userId}/${criteria.type}`,
          });


        }
      } catch (error: any) {
        if (criteria.id) {
          if (error.message == 204) {

            const index = this.listConversation.findIndex((conv) => conv.id === criteria.id);

            if (index !== -1) {
              const type = this.listConversation[index].type;
              this.listConversation = this.listConversation.filter((item) => item.id !== criteria.id);
              this.handelSelectAction(this.listConversation[index]?.id);

              if (type === 'text') {
                this.lengthListChatText = this.lengthListChatText - 1
              } else if (type === 'image') {
                this.lengthListChatImage = this.lengthListChatImage - 1
              }
            }
          } else {
            console.log("Error in delete conv", error.message);
            throw error;
          }
        }
        else if (criteria.type) {
          if (error.message == 204) {
            this.listConversation = this.listConversation.filter((item) => item.type !== criteria.type);
            this.handelSelectAction('');
          } else {
            console.log("Error in delete conv", error.message);
            throw error;
          }
        }
        else {
          console.log("Error in delete conv", error.message);
          throw error;
        }


      }

    },




    async pinConvAction(id: string, isPin: boolean) {
      const index = this.listConversation.findIndex(item => item.id === id);

      if (index !== -1) {
        // Update the local listConversation array
        this.listConversation[index].isPin = isPin;

        const data = {
          isPin: this.listConversation[index].isPin,
        };

        try {
          const result = await put<Chat.ReqConv>({
            url: `conversation/${id}/`,  // Use the provided 'id' parameter
            data,
          });

          console.log('PUT Success:', result);
        } catch (error: any) {
          console.error('PUT Error:', error.message);
          throw error;
        }
      } else {
        throw 'Not found id';
      }
    },


    async updateOrAddConversation(conversation: Chat.ResConv): Promise<void> {
      try {
      
        const existingConversationIndex = this.listConversation.findIndex(
          (c) => c.id === conversation.id
        );

        if (existingConversationIndex !== -1) {
       
          this.listConversation = this.listConversation.map((c, index) =>
            index === existingConversationIndex ? conversation : c);
          console.log("existingConversationIndex !== -1");
        } else {
          // If the conversation does not exist, add it to the list
          this.listConversation = [...this.listConversation, conversation];
          console.log("existingConversationIndex ====== -1");

        }
        this.handelSelectAction(conversation.id)
      } catch (error: any) {
        console.log("error in updateOrAddConversation", error);
        throw error;
      }
    },

    async getConversationAction(conversationId: string): Promise<void> {
      try {
        const result = await get<Chat.ResConv>({
          url: `conversation/${conversationId}`,
        });
        if (result) {
          await this.updateOrAddConversation(result);
        }
      } catch (error: any) {
        console.log("error in getConversationAction", error);
        throw error;
      }
    },

    async getListChatAction() {
      try {
        const conversationId = this.currentConversation.id
        
        // Fetch questions and their related answers
        const { data: questions, error: questionError } = await supabase
          .from('question')
          .select('id, conversation_id, content, created_at, updated_at, question_media(*), answer(id, content,status, created_at, updated_at, answer_media(*))') // Fetching related answers
          .eq('conversation_id', conversationId)

        if (questionError) {
          throw questionError
        }

        // Transform data
    const camelData = questions.map(question => ({
      messageUser: {
        id: question.id,
        text: question.content,
        createdAt: question.created_at,
        updatedAt: question.updated_at,
        questionMedia: question.question_media.map(media => ({
          id: media.id,
          questionId: media.question_id,
          mediaUrl: media.media_url,
          mediaType: media.media_type,
          createdAt: media.created_at,
          updatedAt: media.updated_at,
        })),
      },
      messageAi: question.answer.map(answer => ({
        id: answer.id,
        text: answer.content,
        createdAt: answer.created_at,
        updatedAt: answer.updated_at,
        answerMedia: answer.answer_media.map(media => ({
          id: media.id,
          answerId: media.answer_id,
          mediaUrl: media.media_url,
          mediaType: media.media_type,
          createdAt: media.created_at,
          updatedAt: media.updated_at,
        })),
      })),
      currentIndex: 0, // Assuming a default value for currentIndex
    }));

        console.log('camelData', camelData)

        // Update the conversation
        const index = this.listConversation.findIndex(conv => conv.id === this.currentConversation.id)
        if (index !== -1) {
          this.listConversation[index].chat = camelData
        }
        this.currentConversation.chat = camelData

      } catch (error:any) {
        console.error('Error fetching chat data:', error.message)
        throw error
      }
  
    
      // try {
      //   const userStore = useUserStore();
      //   const userId: string = userStore.userInfo!.user!.id!;
      //   const conversationId = this.currentConversation.id
      //   if (!this.currentConversation.chat || this.currentConversation.chat.length === 0) {
      //     if (conversationId) {
      //       const existingConversation = this.listConversation.find(conv => conv.id === conversationId);

      //       if (!existingConversation) {

      //         try {
             
      //           await this.getConversationAction(conversationId);
             
      //         } catch (error: any) {
      //           console.log("Error fetching conversation details:", error.message);
      //           throw error;
      //         }
      //       }

      //       let conversation = this.listConversation.find((conv) => conv.id === this.currentConversation.id);
      //       if (conversation) {

      //         this.currentConversation = { ...conversation }

      //       }
            
      //       try {
      //         const data = {
      //           conversationId: conversationId,
      //         };
      //         const url = this.currentConversation.type === 'image' ? 'images/' : 'messages/';
      //         const result = await get<Chat.Item[]>({
      //           url: url,
      //           data,
      //         });
      //         if (conversationId === this.currentConversation.id) {
              
      //        const index =    this.listConversation.findIndex((conv) => conv.id === this.currentConversation.id);
      //        this.listConversation[index].chat = result
      //           this.currentConversation.chat = result;
      //         }
      //         else {
          
      //           this.currentConversation.chat = [];
      //         }


      //       } catch (error: any) {
      //         console.log("error", error.message);
      //         throw error;
      //       }
      //     }
      //   }
      // } catch (error: any) {
      //   console.log("error", error.message);
      //   throw error;
      // }
    },




    addMessageChat(text: string, imagePath?: string) {
      const initItem: Chat.Item = {
        currentIndex: 0,
        messageUser: {
          text: text,
          imagePath: imagePath,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          inversion: true,
        },
        messageAi: [
          {
            text: '',
            imagePath: "",
            inversion: false,
            error: false,
            loading: true,
            isLike: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
      };
      this.currentConversation.chat = [...this.currentConversation.chat, initItem]
      console.log(this.currentConversation)
    },


    async updateMessageTextChat({ loading, error, index, res }: { loading: boolean, error: boolean, index: number, res?: Chat.ResChatText }) {
      const chatArray = this.currentConversation.chat;
      // console.log("the argument", loading, error, index, res);
      if (chatArray.length === 0) {
        console.error("Chat array is empty. Unable to update the last element.");
        throw "Chat array is empty. Unable to update the last element.";
      }


      const lastMessageAIArray = chatArray[index].messageAi;

      if (lastMessageAIArray.length === 0) {
        console.error("MessageAI array is empty. Unable to update the last element.");
        throw "MessageAI array is empty. Unable to update the last element.";
      }

      const lastMessageAIIndex = lastMessageAIArray.length - 1;

      if (res && res.conversation && res.conversation.id && this.currentConversation.id === '') {
        // console.log("this.listConversation", this.listConversation);
        this.currentConversation.id = res.conversation.id;
        if (res.conversation.title) {
          this.currentConversation.title = res.conversation.title
        } else {
          this.currentConversation.title = this.currentConversation.chat[0].messageUser.text
        }

        this.listConversation = [this.currentConversation, ...this.listConversation];
        await this.handelSelectAction(this.currentConversation.id);
        this.loadingMessage = true
        if (this.currentConversation.type === 'text') {
          this.lengthListChatText = this.lengthListChatText + 1
        } else if (this.currentConversation.type === 'image') {
          this.lengthListChatImage = this.lengthListChatImage + 1
        }

      }

      if (res?.messageAi) {
        // if (res.messageAi.textTran) {
        //   console.error("MessageAIoo", res.messageAi.textTran);
        // }

        if (res.conversation.createdAt !== undefined) {
          this.currentConversation.updatedAt = res.conversation.createdAt;
        }
        if (this.currentConversation.type === 'image') {
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].id = res.messageAi[0].id ?? '';
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].imagePath = res.messageAi[0].imagePath ?? '';
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].loading = res?.messageAi[0].loading ?? loading;
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].error = error;
          // console.log("res.messageAi[o].id", res.messageAi[0].id)

          for (let i = 1; i < res.messageAi.length; i++) {

            this.currentConversation.chat[index].messageAi.push({
              id: res.messageAi[i].id ?? '',
              text: res.messageAi[i].text ?? '',
              imagePath: res.messageAi[i].imagePath ?? '',
              loading: res.messageAi[i].loading ?? false,
              isLike: null,
              inversion: false,
              error: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          // console.log(this.currentConversation.chat[index].messageAi.length);

        } else {
          console.log("res?.messageAi.textTran", res.messageAi)
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].id = res.messageAi.id ?? '';
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].text += res.messageAi.text ?? '';
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].loading = res?.messageAi.loading ?? loading;
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].textTranInfo = res.messageAi.textTranInfo;
          this.currentConversation.chat[index].messageAi[lastMessageAIIndex].error = error;
          if (error) {
            this.currentConversation.chat[index].messageAi[lastMessageAIIndex].text = '';
          }
          console.log("r    this.currentConversation.chat[index].messageAi[lastMessageAIIndex].textTranInfo", this.currentConversation.chat[index].messageAi[lastMessageAIIndex].textTranInfo)
        }
      } else {
        this.currentConversation.chat[index].messageAi[lastMessageAIIndex].loading = loading;
      }

      if (res?.messageUser) {
        this.currentConversation.chat[index].messageUser.id = res.messageUser.id;
      }

      this.currentConversation.chat[index].messageAi[lastMessageAIIndex].error = error;
    },


    addChildMessage(index: number) {
      const newMessage: Chat.MessageAI = {
        text: '',
        imagePath: "",
        inversion: false,
        error: false,
        loading: true,
        isLike: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("this.currentConversation.chat[index].messageAi.length;", this.currentConversation.chat[index].messageAi.length)
      this.currentConversation.chat[index].currentIndex = this.currentConversation.chat[index].messageAi.length;
      this.currentConversation.chat[index].messageAi.push(newMessage);

    },

    async setCurrentByIdAction(conv: Chat.ResConv) {
      this.currentConversation = conv
      await this.reloadRoute(conv.id)
    },

    async handelSelectAction(convId: string) {
      const selectedConversation = this.listConversation.find(c => c.id === convId);
      if (selectedConversation) {
        this.currentConversation = { ...selectedConversation };
        // this.currentConversation = selectedConversation;
        await this.reloadRoute(selectedConversation.id);
      }
      else {
        this.resetChatState()
        console.log("Selected Conversation not found", selectedConversation)
      }

      this.recordState()
    },
    async reloadRoute(uuid?: string) {
      // await router.push({ name: 'Chat', params: { uuid } })
    },
    async resetController() {
     this.loadingMessage = false
     this.controller.abort();
     this.controller = new AbortController();
  },
    async resetChatState() {
      this.currentConversation = defaultCurrentConversation(this.currentConversation.type)
      await this.reloadRoute(this.currentConversation.id)
    },

    recordState() {
      setLocalState(this.currentConversation.type, this.$state)
    },
  }
})