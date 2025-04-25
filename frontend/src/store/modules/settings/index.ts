import { defineStore } from 'pinia'
import type { SettingsState } from './helper'
import { defaultSetting, getLocalState, removeLocalState, setLocalState } from './helper'
import { supabase } from '@/utils/supabase'
import { camelToSnake, snakeToCamel } from '@/utils/functions'

const tableName = 'app_setting'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),
  actions: {
    async fetchDataAction(): Promise<void> {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*, defaultAiModel:ai_model(*)')
          .single()

        if (error) throw error

        if (data) {
          console.log("data")
          const camelData = snakeToCamel(data) as PublicApp.AppSetting
          this.updateSetting({ settings: camelData })
        }
      } catch (error: any) {
        console.error('Error fetching settings:', error.message)
        throw error
      }
    },
    async updateDataAction(settings: PublicApp.AppSetting): Promise<void> {
      try {
        // Create a new object with all properties except defaultAiModel
        const { defaultAiModel, ...otherSettings } = settings
        
        // Create the update object
        const updateData = {
          ...otherSettings,
          defaultAiModel: defaultAiModel?.id 
        }
        console.log(updateData)
        const snakeSettings = camelToSnake(updateData)

        const { error } = await supabase
          .from(tableName)
          .update(snakeSettings)
          .eq('id', settings.id)

        if (error) throw error

        // If the update was successful, update the local state
        this.updateSetting({ settings })
      } catch (error: any) {
        console.error('Error updating settings:', error.message)
        throw error
      }
    },
    async fetchPrivacyPolicyEn(): Promise<void> {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('privacy_policy_en')
          .single()

        if (error) throw error

        if (data) {
          this.updateSetting({ privacyPolicyEn: data.privacy_policy_en })
        }
      } catch (error: any) {
        console.error('Error fetching English privacy policy:', error.message)
        throw error
      }
    },
    async fetchPrivacyPolicyAr(): Promise<void> {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('privacy_policy_ar')
          .single()

        if (error) throw error

        if (data) {
          this.updateSetting({ privacyPolicyAr: data.privacy_policy_ar })
        }
      } catch (error: any) {
        console.error('Error fetching Arabic privacy policy:', error.message)
        throw error
      }
    },
    async updatePrivacyPolicyEn(policy: string): Promise<void> {
      try {
        const { error } = await supabase
          .from(tableName)
          .update({ privacy_policy_en: policy })
          .eq('id', this.$state.settings?.id)

        if (error) throw error

        this.updateSetting({ privacyPolicyEn: policy })
      } catch (error: any) {
        console.error('Error updating English privacy policy:', error.message)
        throw error
      }
    },
    async updatePrivacyPolicyAr(policy: string): Promise<void> {
      try {
        const { error } = await supabase
          .from(tableName)
          .update({ privacy_policy_ar: policy })
          .eq('id', this.$state.settings?.id)

        if (error) throw error

        this.updateSetting({ privacyPolicyAr: policy })
      } catch (error: any) {
        console.error('Error updating Arabic privacy policy:', error.message)
        throw error
      }
    },
    updateSetting(settings: Partial<SettingsState>) {
      this.$state = { ...this.$state, ...settings }
      this.recordState()
    },
    resetSetting() {
      this.$state = defaultSetting()
      removeLocalState()
    },
    recordState() {
      setLocalState(this.$state)
    },
    async fetchTermsOfUseEn(): Promise<void> {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('terms_of_use_en')
          .single()

        if (error) throw error

        if (data) {
          this.updateSetting({ termsOfUseEn: data.terms_of_use_en })
        }
      } catch (error: any) {
        console.error('Error fetching English terms of use:', error.message)
        throw error
      }
    },
    async fetchTermsOfUseAr(): Promise<void> {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('terms_of_use_ar')
          .single()

        if (error) throw error

        if (data) {
          this.updateSetting({ termsOfUseAr: data.terms_of_use_ar })
        }
      } catch (error: any) {
        console.error('Error fetching Arabic terms of use:', error.message)
        throw error
      }
    },
    async updateTermsOfUseEn(terms: string): Promise<void> {
      try {
        const { error } = await supabase
          .from(tableName)
          .update({ terms_of_use_en: terms })
          .eq('id', this.$state.settings?.id)

        if (error) throw error

        this.updateSetting({ termsOfUseEn: terms })
      } catch (error: any) {
        console.error('Error updating English terms of use:', error.message)
        throw error
      }
    },
    async updateTermsOfUseAr(terms: string): Promise<void> {
      try {
        const { error } = await supabase
          .from(tableName)
          .update({ terms_of_use_ar: terms })
          .eq('id', this.$state.settings?.id)

        if (error) throw error

        this.updateSetting({ termsOfUseAr: terms })
      } catch (error: any) {
        console.error('Error updating Arabic terms of use:', error.message)
        throw error
      }
    }
  },
})