import { defineStore } from 'pinia'
import type { AppState, Language, Theme } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'
import { store } from '@/store/helper'
import { useBasicLayout } from '@/hooks/useBasicLayout'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      this.recordState()
    },
    setSiderCollapsedChat(collapsed: boolean) {
      this.siderCollapsedChat = collapsed
      this.recordState()
    },

    setTheme(theme: Theme) {
      this.theme = theme
      this.recordState()
    },

    setLanguage(language: Language) {
      if (this.language !== language) {
        this.language = language
        this.recordState()
      }
    },
    setlightThemeVars(themeVars: PublicApp.ThemeVars) {
      this.lightThemeVars = themeVars
      this.recordState()
    },

    setDarkThemeVars(themeVars: PublicApp.ThemeVars) {
      this.darkThemeVars = themeVars
      this.recordState()
    },

    getSpan():number{
      const { isMobile } = useBasicLayout();
      const span = computed(() => (isMobile ? 24 : 12));
      return span.value
    },

    recordState() {
      setLocalSetting(this.$state)
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
