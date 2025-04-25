
export const initState = (): API.Question => ({
  id: '',
  title: '',
  content: '',
  category: 'general',
  createdAt: '',
  updatedAt: '',
  userId: '',
  files: []
})

export interface QuestionState {
  questions: API.Question[]
  currentQuestion: API.Question | null
} 