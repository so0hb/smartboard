import { defineStore } from 'pinia'
import { createBaseStore } from '../baseStore'
import { initState } from './helper'

import { get, post, del } from '@/utils/request'

const baseStore = createBaseStore<API.Question>('questions', initState)

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const useQuestionsStore = defineStore('questions-store', {
    state: () => ({
        listData: [] as any[],
        loadingInit: true,
        showAdd: false,
        showUpdate: false,
        countTotalData: 0,
        bucket: 'questions'
      }),
    
      actions: {
 
    async fetchQuestions() {
      try {
        const data = await get<PaginatedResponse<any>>({
          url: 'discussions/questions/'
        })
        // if (error) throw error
        this.listData = data.results
        this.countTotalData = data.count
        return data.results
      } catch (error) {
        throw error
      }
    },

    async getQuestionById(id: string) {
      try {
        const  data = await get({
          url: `discussions/questions/${id}/`
        })

       
        console.log("data11", data)
        return data
      } catch (error: any) {
        throw error
      }
    },

    async submitAnswer(questionId: string, content: string) {
      try {
        const { data, error } = await post({
          url: `discussions/questions/${questionId}/answers/`,
          data: { content }
        })

        if (error) throw error
        return data
      } catch (error: any) {
        throw error
      }
    },

    async deleteQuestion(id: string) {
      try {
        const { error } = await del({
          url: `discussions/questions/${id}/`
        })

        if (error) throw error
        this.listData = this.listData.filter(q => q.id !== id)
      } catch (error: any) {
        throw error
      }
    }
  }
}) 