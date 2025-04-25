import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'

interface MonthlyData {
  month: string
  clientCount: number
  expertCount: number
  aiConvCount: number
  expertConvCount: number
}

interface DashboardState extends API.DashboardState {
  monthlyData: MonthlyData[]
  monthlyDataLoading: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    clientCount: 0,
    expertCount: 0,
    adminCount: 0,
    aiCompanyCount: 0,
    aiModelCount: 0,
    questionCount: 0,
    convAICount: 0,
    convExpertCount: 0,
    monthlyData: [],
    monthlyDataLoading: false
  }),

  actions: {
    async fetchDashboardData() {
      try {
        // Fetch current counts
        const [
          { count: clientCount },
          { count: expertCount },
          { count: adminCount },
          { count: aiCompanyCount },
          { count: aiModelCount },
          { count: questionCount },
          { count: convClientCount },
          { count: convExpertCount },
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'Client'),
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'Agri-Expert'),
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'Admin'),
          supabase.from('ai_company').select('*', { count: 'exact', head: true }),
          supabase.from('ai_model').select('*', { count: 'exact', head: true }),
          supabase.from('question').select('*', { count: 'exact', head: true }),
          supabase.from('conversation').select('*', { count: 'exact', head: true }).eq('type', 'AI'),
          supabase.from('conversation_with_questions').select('*', { count: 'exact', head: true }),
        ])

        this.clientCount = clientCount || 0
        this.expertCount = expertCount || 0
        this.adminCount = adminCount || 0
        this.aiCompanyCount = aiCompanyCount || 0
        this.aiModelCount = aiModelCount || 0
        this.questionCount = questionCount || 0
        this.convAICount = convClientCount || 0
        this.convExpertCount = convExpertCount || 0

        // Fetch monthly data
        await this.fetchMonthlyData()
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    },

    async fetchMonthlyData() {
      this.monthlyDataLoading = true
      try {
        // Get the last 6 months
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          return date.toISOString().slice(0, 7) // Format: YYYY-MM
        }).reverse()

        const monthlyData: MonthlyData[] = await Promise.all(
          months.map(async (month) => {
            const startDate = `${month}-01`
            const endDate = `${month}-${new Date(month + '-01').getMonth() === 11 ? '31' : '30'}`

            const [
              { count: monthlyClientCount },
              { count: monthlyExpertCount },
              { count: monthlyAIConvCount },
              { count: monthlyExpertConvCount }
            ] = await Promise.all([
              // Count users created in this month
              supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('user_type', 'Client')
                .gte('created_at', startDate)
                .lte('created_at', endDate),
              
              supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('user_type', 'Agri-Expert')
                .gte('created_at', startDate)
                .lte('created_at', endDate),
              
              // Count conversations in this month
              supabase
                .from('conversation')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'AI')
                .gte('created_at', startDate)
                .lte('created_at', endDate),
              
              supabase
                .from('conversation_with_questions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startDate)
                .lte('created_at', endDate)
            ])

            return {
              month: new Date(startDate).toLocaleDateString('en-US', { month: 'short' }),
              clientCount: monthlyClientCount || 0,
              expertCount: monthlyExpertCount || 0,
              aiConvCount: monthlyAIConvCount || 0,
              expertConvCount: monthlyExpertConvCount || 0
            }
          })
        )

        this.monthlyData = monthlyData
      } catch (error) {
        console.error('Error fetching monthly data:', error)
      } finally {
        this.monthlyDataLoading = false
      }
    }
  }
})

