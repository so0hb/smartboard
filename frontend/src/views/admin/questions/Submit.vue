<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { t } from '@/locales'
import { BaseUpload } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { FormInst, FormRules, UploadFileInfo } from 'naive-ui'
import { post } from '@/utils/request'
import { useUserStore } from '@/store'
import axios from 'axios'
import { baseURL } from '@/utils/request/axios'
import { NImage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const { isMobile } = useBasicLayout()
const userStore = useUserStore()

const span = computed(() => isMobile ? 24 : 12)

const model = ref({
  title: ' what is the capital of france',
  content: 'what is the capital of france',
  category: 'general',
  files: [] as File[]
})

const fileList = ref<UploadFileInfo[]>([])

const rules: FormRules = {
  title: {
    required: true,
    message: t('common.titleRequired'),
    trigger: ['blur', 'input']
  },
  content: {
    required: true,
    message: t('common.contentRequired'),
    trigger: ['blur', 'input']
  },
  category: {
    required: true,
    message: t('common.categoryRequired'),
    trigger: ['blur', 'change']
  }
}

const categoryOptions = [
  { label: t('common.general'), value: 'general' },
  { label: t('common.technical'), value: 'technical' },
  { label: t('common.other'), value: 'other' }
]

const isImageFile = (file: File) => {
  return file.type.startsWith('image/')
}

const handleUploadChange = ({ file }: { file: UploadFileInfo }) => {
  if (file.file) {
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.file.size > MAX_SIZE) {
      message.error(t('common.fileTooLarge'))
      return
    }

    if (isImageFile(file.file)) {
      file.url = URL.createObjectURL(file.file)
    }

    model.value.files.push(file.file)
    fileList.value.push(file)
  }
}

async function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  
  if (!userStore.user) {
    message.error(t('common.pleaseLogin'))
    return
  }

  try {
    await formRef.value?.validate()
    loading.value = true

    const formData = new FormData()
    formData.append('title', model.value.title)
    formData.append('content', model.value.content)
    formData.append('category', model.value.category)
    
    if (userStore.user && userStore.user.id) {
      formData.append('user_id', userStore.user.id.toString())
    }
    
    model.value.files.forEach((file, index) => {
      formData.append('files', file)
    })

    const response = await axios.post((baseURL + 'discussions/questions/'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    message.success(t('common.submitSuccess'))
    loading.value = false
    router.push(`/admin/questions/${response.data.id}`)
    
    model.value = {
      title: '',
      content: '',
      category: 'general',
      files: []
    }
    fileList.value = []
  }
  catch (error: any) {
    loading.value = false
    message.error(error.message || t('common.submitFailed'))
  }
}

onBeforeUnmount(() => {
  fileList.value.forEach(file => {
    if (file.url && file.url.startsWith('blob:')) {
      URL.revokeObjectURL(file.url)
    }
  })
})
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h2 class="text-2xl font-bold">{{ t('common.submitNewQuestion') }}</h2>
    </div>

    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="top"
    >
      <NGrid :x-gap="12" :y-gap="8" :cols="24">
        <NFormItemGi :span="span" path="title" :label="t('common.title')">
          <NInput v-model:value="model.title" clearable />
        </NFormItemGi>

        <NFormItemGi :span="span" path="category" :label="t('common.category')">
          <NSelect
            v-model:value="model.category"
            :options="categoryOptions"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi :span="24" path="content" :label="t('common.content')">
          <NInput
            v-model:value="model.content"
            type="textarea"
            :rows="4"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi :span="24" :label="t('common.attachments')">
          <NUpload
            accept="*"
            multiple
            :max="5"
            :file-list="fileList"
            @change="handleUploadChange"
            :show-file-list="true"
          
          >
            <NButton>{{ t('common.uploadFile') }}</NButton>
          </NUpload>
        </NFormItemGi>
      </NGrid>

      <div class="flex justify-end gap-2 mt-4">
        <NButton @click="router.back()">
          {{ t('common.cancel') }}
        </NButton>
        <NButton 
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ t('common.submit') }}
        </NButton>
      </div>
    </NForm>
  </div>
</template> 