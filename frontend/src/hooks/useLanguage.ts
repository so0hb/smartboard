import { computed } from 'vue'
import { enUS, koKR, zhCN, zhTW, arDZ } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'ru-RU':
        setLocale('ru-RU')
        return enUS
      case 'ko-KR':
        setLocale('ko-KR')
        return koKR
      case 'zh-CN':
        setLocale('zh-CN')
        return zhCN
      case 'zh-TW':
        setLocale('zh-TW')
        return zhTW
      case 'ar-DZ':
        setLocale('ar-DZ')
        return arDZ
      default:
        setLocale('en-US')
        return enUS
    }
  })

  return { language }
}
