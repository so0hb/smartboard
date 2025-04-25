<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NPopconfirm, NSelect, useDialog, useMessage } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import SelectSystemPromt from '../../../views/chat/components/ParamsSelect/SelectSystemPromt.vue'
import { useAppStore, useChatStore, useUserStore } from '@/store'
import { getCurrentDate } from '@/utils/functions'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
const appStore = useAppStore()
const userStore = useUserStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const dialog = useDialog()
const ms = useMessage()

const theme = computed(() => appStore.theme)

const userInfo = computed(() => userStore.userInfo)
const totalCountText = computed(() => chatStore.listConversation.filter(item=>item.type === 'text').length)
const totalCountImage = computed(() => chatStore.listConversation.filter(item=>item.type === 'image').length)
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
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  {label: 'العربية', key: 'ar-DZ', value: 'ar-DZ' },
  // { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
  // { label: '繁體中文', key: 'zh-TW', value: 'zh-TW' },
  { label: 'English', key: 'en-US', value: 'en-US' },
  // { label: '한국어', key: 'ko-KR', value: 'ko-KR' },
  // { label: 'Русский язык', key: 'ru-RU', value: 'ru-RU' },
]



function exportData(): void {
  const date = getCurrentDate()
  const data: string = localStorage.getItem('chatStorage') || '{}'
  const jsonString: string = JSON.stringify(JSON.parse(data), null, 2)
  const blob: Blob = new Blob([jsonString], { type: 'application/json' })
  const url: string = URL.createObjectURL(blob)
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = url
  link.download = `chat-store_${date}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function importData(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target || !target.files)
    return

  const file: File = target.files[0]
  if (!file)
    return

  const reader: FileReader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      localStorage.setItem('chatStorage', JSON.stringify(data))
      ms.success(t('common.success'))
      location.reload()
    }
    catch (error) {
      ms.error(t('common.invalidFileFormat'))
    }
  }
  reader.readAsText(file)
}

async function clearData(): Promise<void> {
  await chatStore.deleteAllConversationData()
  localStorage.removeItem('chatStorage')
  location.reload()
}

function handleImportButtonClick(): void {
  const fileInput = document.getElementById('fileInput') as HTMLElement
  if (fileInput)
    fileInput.click()
}

// function handleDeleteAction() {
//     const deleteDialog = dialog.warning({
//         title: t('chat.deleteConfirmation'),
//         content: t('chat.deleteConfirmationMessage'),
//         positiveText: t('common.yes'),
//         negativeText: t('common.no'),
//         onPositiveClick: async () => {
//             try {
//                 deleteDialog.loading = true
//                 await clearData();
//                 ms.success(t('chat.deleteSuccess'));
//             } catch (error: any) {
//                 deleteDialog.loading = false
//                 ms.error(t('chat.deleteFailed'));
//             } finally {
//                 deleteDialog.loading = false
//             }
//         },
//     });
// }
const loadingDelete = ref<boolean>(false)
  const message = useMessage()
async function deleteAllChat(criteria: Partial<Chat.ResConv>) {
  try {
    loadingDelete.value = true;
    await chatStore.deleteConversationAction(criteria);
  } catch (error) {
    console.error("Error deleting conversation:", error);

  } finally {
    loadingDelete.value = false;
  }
}
function handleDeleteAction(criteria: Partial<Chat.ResConv>) {
  const deleteDialog = dialog.warning({
    title: t('chat.deleteConfirmation'),
    content: t('chat.deleteConfirmationMessage'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        deleteDialog.loading = true
        await deleteAllChat(criteria);
        message.success(t('chat.deleteSuccess'));
      } catch (error: any) {
        deleteDialog.loading = false
        message.error(t('chat.deleteFailed'));
      } finally {
        deleteDialog.loading = false
      }
    },
  });
}

async function handleDeleteAllConvAction(){
  const deleteDialog = dialog.warning({
    title: t('chat.deleteConfirmation'),
    content: t('chat.deleteConfirmationMessage'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        deleteDialog.loading = true
        await deleteAllChat({type:'text' as PublicApp.TypeService});
        await deleteAllChat({type:'image' as PublicApp.TypeService});
        message.success(t('chat.deleteSuccess'));
        location.reload()
      } catch (error: any) {
        deleteDialog.loading = false
        message.error(t('chat.deleteFailed'));
      } finally {
        deleteDialog.loading = false
      }
    },
  });

}
</script>

<template>


<div class="flex flex-col gap-2">

  <div class="grid grid-cols-2">
        <div>{{ $t('setting.language') }}</div>
        <div>
          <NSelect
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          />
        </div>
  </div>




   

<!--    
 
        <NButton 
        :disabled="totalCountText <= 0"
        size="small" 
        type="error" 
        style="width: 300px;"
        @click="handleDeleteAction({type:'text' as PublicApp.TypeService})">
            <template #icon>
              <SvgIcon icon="fluent:delete-32-regular" />
            </template>
            {{ $t('chat.deleteAllChatsText') }}
          </NButton>
    
        <NButton 
        :disabled="totalCountImage <= 0"
        size="small" 
        type="error"
        style="width: 300px;"
        @click="handleDeleteAction({type:'image' as PublicApp.TypeService})"
      >
   
            <template #icon>
              <SvgIcon icon="fluent:delete-32-regular" />
            </template>
            {{ $t('chat.deleteAllChatsImage') }}
          </NButton>

        <NButton 
        :disabled="totalCountText <= 0 && totalCountImage <= 0"
        :loading="loadingDelete"
        size="small" 
        style="width: 300px;"
        type="error" @click="handleDeleteAllConvAction">
            <template #icon>
              <SvgIcon icon="fluent:delete-32-regular" />
            </template>
            {{ $t('chat.deleteAllChatsTextAndImage') }}
          </NButton>
  -->


          <!-- <div class="flex items-center justify-between">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.theme') }}</span>
        <div class="flex flex-wrap items-center gap-4">
      
       <template v-for="item of themeOptions" :key="item.key">
         
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
      </div> -->


</div>
  <!-- <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
 -->


      <!-- <div
        class="flex items-center space-x-4"
        :class="isMobile && 'items-start'"
      >
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.chatHistory') }}</span>

        <div class="flex flex-wrap items-center gap-4">
          <NButton size="small" @click="exportData">
            <template #icon>
              <SvgIcon icon="ri:download-2-fill" />
            </template>
            {{ $t('common.export') }}
          </NButton>

          <input id="fileInput" type="file" style="display:none" @change="importData">
          <NButton size="small" @click="handleImportButtonClick">
            <template #icon>
              <SvgIcon icon="ri:upload-2-fill" />
            </template>
            {{ $t('common.import') }}
          </NButton>

          <NPopconfirm placement="bottom" @positive-click="clearData">
            <template #trigger>
              <NButton size="small">
                <template #icon>
                  <SvgIcon icon="ri:close-circle-line" />
                </template>
                {{ $t('common.clear') }}
              </NButton>
            </template>
            {{ $t('chat.clearHistoryConfirm') }}
          </NPopconfirm>
        </div>
      </div> -->

 


   
<!-- 
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.language') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <NSelect
            style="width: 140px"
            :value="language"
            :options="languageOptions"
            @update-value="value => appStore.setLanguage(value)"
          />
        </div>
      </div>

  <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.select') }}</span>
        <div class="flex flex-wrap items-center gap-4">
          <SelectSystemPromt/>
        </div>
      </div> -->
<!--     
      <div class="flex items-center space-x-4">
        <div>  {{ $t('chat.clearAllChats') }}</div>
        <NButton size="small" type="error" @click="handleDeleteAction">
            <template #icon>
              <SvgIcon icon="fluent:delete-32-regular" />
            </template>
            {{ $t('common.delete') }}
          </NButton>
      </div>
    </div>

    <div class="flex items-center space-x-4">
        <div>   {{ $t('chat.deleteAllChatsText') }}</div>
        <NButton size="small" type="error" @click="handleDeleteAction">
            <template #icon>
              <SvgIcon icon="fluent:delete-32-regular" />
            </template>
            {{ $t('common.delete') }}
          </NButton>
      </div>
 


    <div class="flex items-center space-x-4">
        <div>   {{ $t('chat.deleteAllChatsText') }}</div>
        <NButton size="small" type="error" @click="handleDeleteAction">
            <template #icon>
              <SvgIcon icon="fluent:delete-32-regular" />
            </template>
            {{ $t('common.delete') }}
          </NButton>
      </div>

  </div>

  -->
  

</template>
