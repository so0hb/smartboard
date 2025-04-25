<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore } from '@/store'
import { t } from '@/locales'
const router = useRouter()
function goHome() {
  router.push('/')
}


const appStore = useAppStore()
const theme = computed(() => appStore.theme)


const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})

const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  // {
  //   label: 'Dark',
  //   key: 'dark',
  //   icon: 'ri:moon-foggy-line',
  // },
]

const menuOptions = [
  {
    label: () => h('a', { href: '#' }, 'Home'),
    key: 'home'
  },
  {
    label: () => h('a', { href: '#' }, 'Contact'),
    key: 'contact'
  }
]
const languageOptions: { label: string; key: Language; value: Language }[] = [
  // { label: 'العربية', key: 'ar-DZ', value: 'ar-DZ' },
  { label: 'English', key: 'en-US', value: 'en-US' },

]




</script>

<template>
  <div class="py-0  pt-2 mb-4 lg:pt-4 flex px-24">
    <div class="flex justify-around w-full glass py-1 md:py-3 rounded-lg dark:bg-violet-800">
      <div class="navbar-start text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
        <button
          @click="goHome"
         
        >
          {{ t('common.nameApp') }}
        </button>
      </div>
 
      <!-- <n-menu mode="horizontal" :options="menuOptions" /> -->

      <div class="navbar-end gap-4 flex">

        <NPopselect
          :value="language"
          :options="languageOptions"
          @update-value="value => appStore.setLanguage(value)"
        >
          <SvgIcon
            icon="material-symbols:language"
            class="h-8 w-8 gtext cursor-pointer hover:border-none"
          />
        </NPopselect>


        <div class="flex flex-wrap items-center gap-4">
          <template
            v-for="item of themeOptions"
            :key="item.key"
          >
            <NButton
              size="small"
              :type="item.key === theme ? 'primary' : undefined"
              @click="appStore.setTheme(item.key)"
            >
              <template #icon>
                <SvgIcon :icon="item.icon" />
            </template>
          </NButton>
        </template>
      </div>



    </div>
  </div>
</div></template>