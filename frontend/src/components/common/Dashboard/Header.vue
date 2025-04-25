<script lang="ts" setup>
import { computed, ref } from 'vue'
import {  SvgIcon, LanguageSelect } from '@/components/common'
import { useAppStore, useUserStore } from '@/store'
import { t } from '@/locales';

interface Props {
  usingContext: boolean

}

interface Emit {
  (ev: 'export'): void
  (ev: 'handleClear'): void
}

defineProps<Props>()
const emit = defineEmits<Emit>()
const appStore = useAppStore()
const collapsed = computed(() => appStore.siderCollapsed)

function handleUpdateCollapsed(type: 'chat' | 'admin') {
  if (type === 'admin')
    appStore.setSiderCollapsed(!collapsed.value)
  else
    appStore.setSiderCollapsedChat(!collapsed.value)
}

const userStore = useUserStore()

const userInfo = computed(() => userStore.$state)
const email = userInfo.value.user?.email ?? '';
const atIndex = email.indexOf('@');
const name = ref(atIndex !== -1 ? email.slice(0, atIndex) : email);
const value = ref(1)
</script>

<template>

  <header
    class="sticky top-0 left-0 mx-3 right-0 z-30 border rounded-lg mt-2 md:mt-0 md:mx-0 md:rounded-none md:py-1 dark:border-neutral-800  dark:bg-black/20 backdrop-blur"
  >

    <div class="relative flex items-center justify-between px-4 md:px-8  min-w-0 overflow-hidden h-14">
      <div class="flex items-center">
        <button
          class="flex items-center justify-center w-11 h-11"
          @click="handleUpdateCollapsed('admin')"
        >
          <SvgIcon v-if="collapsed" class="text-3xl" icon="material-symbols:menu" />
          <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
        </button>
        <a class="gtext btn btn-ghost normal-case text-xl">
      {{ t('common.nameApp') }}
    </a>
      </div>
 
      <h1
        class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
       
      >
        <!-- {{ currentChatHistory?.title ?? '' }}  -->
      </h1>
   
    

   <div class="flex justify-end gap-2">
<!-- <NBadge class="cursor-pointer"  :value="value" :max="99">
    <SvgIcon class="text-2xl text-primary" icon="ion:notifcations" />

</NBadge> -->
    <!-- <div class="avatar placeholder cursor-pointer">
  <div class="bg-neutral text-neutral-content rounded-full w-8">
    <span class="text-2xl"> {{ name.charAt(0).toUpperCase() }}</span>
  </div>
</div>  -->
<LanguageSelect/>
        <!-- <HoverButton @click="handleAdd">
          <span class="text-[1.5rem]  dark:text-white">
            <SvgIcon icon="ci:chat-add" />
          </span>
        </HoverButton> -->
       
      
        <!-- <HoverButton @click="handleExport">
          <span class="text-[1.5rem] text-[#4f555e] dark:text-white">
            <SvgIcon icon="uil:comment-share" />
          </span>
        </HoverButton> -->
        
        <!-- <HoverButton @click="handleClear">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:delete-bin-line" />
          </span>
        </HoverButton> -->
      </div>
    </div>
  </header>

</template>
