<script lang="ts" setup>
import { computed } from 'vue'
import { NSelect, NPopselect } from 'naive-ui'
import { t } from '@/locales'
import type { Language } from '@/store/modules/app/helper'
import { useAppStore, useChatStore, useUserStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
const appStore = useAppStore()
const { isMobile } = useBasicLayout()
const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})
const languageOptions: { label: string; key: Language; value: Language }[] = [
  // {label: 'العربية', key: 'ar-DZ', value: 'ar-DZ' },
  // { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
  // { label: '繁體中文', key: 'zh-TW', value: 'zh-TW' },
  { label: 'English', key: 'en-US', value: 'en-US' },
  // { label: '한국어', key: 'ko-KR', value: 'ko-KR' },
  // { label: 'Русский язык', key: 'ru-RU', value: 'ru-RU' },
]


</script>

<template>


<div class="flex flex-col gap-2">

  <div class="w-36">
       
        <template v-if="!isMobile">
          <NSelect
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          />
        </template>
        <template v-else>
          <NPopselect
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          >
            <SvgIcon
              icon="material-symbols:language"
              class="h-8 w-8 text-current cursor-pointer hover:border-none"
            />
          </NPopselect>
        </template>
  </div>


</div>

</template>
