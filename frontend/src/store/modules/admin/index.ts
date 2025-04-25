// import { defineStore } from 'pinia'
// import type { AppState, Language, Theme } from './helper'
// import { getLocalSetting, setLocalSetting } from './helper'
// import { store } from '@/store/helper'

// export const useAdminStore = defineStore('admin-store', {
//   state: (): AdminState => getLocalSetting(),
//   actions: {
//     setSiderCollapsed(collapsed: boolean) {
//       this.siderCollapsed = collapsed
//       this.recordState()
//     },
//     setSiderCollapsedChat(collapsed: boolean) {
//       this.siderCollapsedChat = collapsed
//       this.recordState()
//     },

//     setTheme(theme: Theme) {
//       this.theme = theme
//       this.recordState()
//     },

//     setLanguage(language: Language) {
//       if (this.language !== language) {
//         this.language = language
//         this.recordState()
//       }
//     },

//     recordState() {
//       setLocalSetting(this.$state)
//     },
//   },
// })

// export function useAppStoreWithOut() {
//   return useAppStore(store)
// }
