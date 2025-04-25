import { defineStore } from 'pinia'
import type {  UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'
export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    updateUserState(userState: Partial<UserState>) {
      this.$state = { ...this.$state, ...userState }
      this.recordState()
    },

    resetUserState() {
      this.$state = { ...defaultSetting() }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})

