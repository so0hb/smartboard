<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useQuestionsStore } from '@/store/modules/questions'
import { SvgIcon } from '@/components/common'
import { post } from '@/utils/request'
import { useUserStore } from '@/store'
import { baseURL } from '@/utils/request/axios'
import axios from 'axios'

// Add interface for media file
interface MediaFile {
  id: string | number
  file: string
  file_type?: string
}

// Add interface for Answer type
interface Answer {
  id: number | string
  content: string
  original_content: string | null
  ai_analysis: string | null
  created_at: string
  updated_at: string
  user: number
  moderation_status: string
  is_duplicate: boolean
  similarity_score: number
}

// Update Question interface to include typed answers array
interface Question {
  id: string | number
  title: string
  content: string
  category: string
  media?: MediaFile[]
  answers?: Answer[]
}

const route = useRoute()
const router = useRouter()
const message = useMessage()
const loading = ref(false)
const submitting = ref(false)
const question = ref<Question | null>(null)
const newAnswer = ref('')
const questionsStore = useQuestionsStore()
const userStore = useUserStore()

// Check if user is admin
const isAdmin = computed(() => {
  return userStore.user?.role === 'admin'
})

// Update the isImageFile function with type checking
const isImageFile = (fileType?: string) => {
  if (!fileType) return false
  return fileType.startsWith('image/')
}

// Add function to get file extension
const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'image/' + extension
    default:
      return 'application/octet-stream'
  }
}

// Update getFileName function to handle URL encoded names
const getFileName = (fileUrl: string) => {
  try {
    // First try to get the last part of the URL path
    const urlParts = fileUrl.split('/')
    const encodedFileName = urlParts[urlParts.length - 1]
    
    // Decode the URL encoded string
    const decodedFileName = decodeURIComponent(encodedFileName)
    
    return decodedFileName
  } catch (error) {
    // Fallback to simple split if decoding fails
    return fileUrl.split('/').pop() || ''
  }
}

// Optional: Add function to truncate long file names
const truncateFileName = (fileName: string, maxLength = 20) => {
  if (fileName.length <= maxLength) return fileName
  
  const extension = fileName.split('.').pop() || ''
  const name = fileName.slice(0, fileName.lastIndexOf('.'))
  
  return `${name.slice(0, maxLength)}...${extension}`
}

// Add function to get file icon name based on type
const getFileIconName = (fileType?: string, fileName?: string) => {
  if (!fileType && !fileName) return 'mdi:file-document-outline'
  
  const type = fileType || getFileType(fileName || '')
  
  if (type.startsWith('image/')) return 'mdi:file-image-outline'
  if (type.startsWith('video/')) return 'mdi:file-video-outline'
  if (type.startsWith('audio/')) return 'mdi:file-music-outline'
  if (type.includes('pdf')) return 'mdi:file-pdf-box'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'mdi:file-excel-outline'
  if (type.includes('javascript') || type.includes('python') || type.includes('code')) return 'mdi:file-code-outline'
  
  return 'mdi:file-document-outline'
}

// Add function to get file type label
const getFileTypeLabel = (fileType?: string, fileName?: string) => {
  if (!fileType && !fileName) return 'Document'
  
  const type = fileType || getFileType(fileName || '')
  
  if (type.startsWith('image/')) return 'Image'
  if (type.startsWith('video/')) return 'Video'
  if (type.startsWith('audio/')) return 'Audio'
  if (type.includes('pdf')) return 'PDF'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'Spreadsheet'
  if (type.includes('javascript') || type.includes('python') || type.includes('code')) return 'Code'
  
  return 'Document'
}

// Get moderation status tag type
const getModerationTagType = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'flagged': return 'warning'
    case 'rejected': return 'error'
    default: return 'default'
  }
}

const questionId = route.params.id as string

const loadQuestion = async () => {
  if (!route.params.id) return

  try {
    loading.value = true
    const response = await axios.get(`${baseURL}discussions/questions/${route.params.id}/`)
    
    if (response.data) {
      question.value = response.data
    }
  } catch (error: any) {
    message.error(error.message || t('common.loadError'))
  } finally {
    loading.value = false
  }
}

async function submitAnswer() {
  if (!newAnswer.value.trim()) {
    message.warning(t('common.answerRequired'))
    return
  }

  if (!userStore.user) {
    message.error(t('common.pleaseLogin'))
    return
  }

  try {
    submitting.value = true
    const { data, error } = await post({
      url: `${baseURL}discussions/questions/${route.params.id}/answers/`,
      data: {
        content: newAnswer.value,
        user_id: userStore.user.id,
        question_id: route.params.id
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) {
      // Handle moderation responses
      if (error.response?.data?.status === 'flagged') {
        message.error(t('common.contentFlagged'))
        return
      }
      if (error.response?.data?.status === 'duplicate') {
        message.warning(t('common.duplicateContent'))
        return
      }
      throw error
    }

    message.success(t('common.submitSuccess'))
    newAnswer.value = ''
    await loadQuestion()
  } catch (error: any) {
    message.error(error.message || t('common.submitFailed'))
  } finally {
    submitting.value = false
  }
}

// Update showAnswer function to be more permissive and add console.log for debugging
const showAnswer = (answer: Answer | undefined | null) => {
  if (!answer) {
    console.log('Answer is null or undefined')
    return false
  }
  
  console.log('Answer status:', answer.moderation_status)
  // Show all answers except rejected ones
  return answer.moderation_status !== 'rejected'
}

onMounted(() => {
  loadQuestion()
})

// Add this to handle route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadQuestion()
    }
  }
)
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <NButton @click="router.back()">{{ t('common.back') }}</NButton>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <NSpin size="large" />
    </div>

    <template v-else>
      <template v-if="question">
        <NCard>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold">{{ question.title }}</h2>
              <NTag :type="question.category === 'technical' ? 'info' : 'success'">
                {{ question.category }}
              </NTag>
            </div>
          </template>

          <div class="space-y-4">
            <div class="question-content">
              {{ question.content }}
            </div>

            <div v-if="question?.media?.length" class="mt-4">
              <h4 class="text-lg font-semibold mb-4">{{ t('common.attachments') }}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="file in question.media" 
                     :key="file.id" 
                     class="transition-all duration-300 group"
                >
                  <!-- Image files -->
                  <template v-if="isImageFile(file.file_type || getFileType(file.file))">
                    <div class="relative overflow-hidden rounded-lg">
                      <NImage
                        :src="file.file"
                        :alt="getFileName(file.file)"
                        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        :preview-src="file.file"
                        :on-error="() => message.error(t('common.imageLoadError'))"
                      />
                      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div class="text-sm text-white truncate">
                          {{ getFileName(file.file) }}
                        </div>
                      </div>
                    </div>
                  </template>
                  
                  <!-- Non-image files -->
                  <template v-else>
                    <NCard class="h-full min-h-[200px] transition-all duration-300 border border-gray-200 hover:shadow-lg hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800 group-hover:border-primary">
                      <div class="flex flex-col h-full">
                        <!-- Top Section -->
                        <div class="flex-1 flex flex-col items-center justify-center p-4">
                          <!-- File Icon -->
                          <div class="w-16 h-16 flex items-center justify-center text-gray-500 mb-3 group-hover:text-primary transition-colors duration-300">
                            <SvgIcon
                              :name="getFileIconName(file.file_type, file.file)"
                              class="w-12 h-12"
                            />
                          </div>
                          
                          <!-- File Name -->
                          <div class="text-sm font-medium text-center mb-2 text-gray-700 dark:text-gray-200 line-clamp-2">
                            {{ getFileName(file.file) }}
                          </div>
                          
                          <!-- File Type Label -->
                          <NTag :type="file.file_type?.includes('pdf') ? 'error' : 'default'" 
                                size="small" 
                                class="group-hover:border-primary">
                            {{ getFileTypeLabel(file.file_type, file.file) }}
                          </NTag>
                        </div>
                        
                        <!-- Download Button Section -->
                        <div class="p-3 border-t bg-gray-50/50 dark:bg-gray-900/50">
                          <NButton
                            class="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                            size="small"
                            tag="a"
                            :href="file.file"
                            target="_blank"
                            download
                            ghost
                          >
                            <template #icon>
                              <SvgIcon name="mdi:download" class="w-4 h-4" />
                            </template>
                            {{ t('common.download') }}
                          </NButton>
                        </div>
                      </div>
                    </NCard>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </NCard>

        <div class="mt-8">
          <h3 class="text-xl font-bold mb-4">{{ t('common.answers') }}</h3>
          <div class="space-y-4">
            <NCard 
              v-for="answer in question?.answers || []" 
              :key="answer.id"
              class="relative"
            >
              <div class="mb-4">
                <div class="text-sm text-gray-500 mb-2 flex items-center gap-2">
                  <span>{{ t('common.answer') }}</span>
                  <NTag :type="getModerationTagType(answer.moderation_status)" size="small">
                    {{ t(`common.${answer.moderation_status}`) }}
                  </NTag>
                </div>
                {{ answer.content }}
              </div>

              <!-- Show original content if exists -->
              <NCollapse v-if="answer.original_content">
                <NCollapseItem>
                  <template #header>
                    <div class="text-sm text-gray-500">
                      {{ t('common.originalAnswer') }}
                    </div>
                  </template>
                  <div class="text-gray-600">
                    {{ answer.original_content }}
                  </div>
                </NCollapseItem>
              </NCollapse>

              <!-- Show AI analysis for admins -->
              <NCollapse v-if="isAdmin && answer.ai_analysis">
                <NCollapseItem>
                  <template #header>
                    <div class="text-sm text-gray-500">
                      {{ t('common.aiAnalysis') }}
                    </div>
                  </template>
                  <div class="text-gray-600">
                    {{ answer.ai_analysis }}
                  </div>
                </NCollapseItem>
              </NCollapse>

              <template #footer>
                <div class="flex justify-between items-center">
                  <NTime :time="new Date(answer.created_at)" />
                  <div class="flex gap-2">
                    <NTag 
                      v-if="answer.similarity_score > 0.5" 
                      type="warning"
                      size="small"
                    >
                      {{ t('common.similarContent') }}
                    </NTag>
                  </div>
                </div>
              </template>
            </NCard>
          </div>
        </div>

        <div class="mt-8">
          <h3 class="text-xl font-bold mb-4">{{ t('common.submitAnswer') }}</h3>
          <NForm>
            <NFormItem>
              <NInput
                v-model:value="newAnswer"
                type="textarea"
                :rows="4"
                :placeholder="t('common.writeYourAnswer')"
              />
            </NFormItem>
            <NButton :loading="submitting" type="primary" @click="submitAnswer" :disabled="!newAnswer">
              {{ t('common.submit') }}
            </NButton>
          </NForm>
        </div>
      </template>
      
      <template v-else>
        <NResult
          status="404"
          :title="t('common.notFound')"
          :description="t('common.questionNotFound')"
        >
          <template #footer>
            <NButton @click="router.push('/admin/questions')">
              {{ t('common.backToList') }}
            </NButton>
          </template>
        </NResult>
      </template>
    </template>

    <!-- Add this temporarily for debugging -->
    <!-- <div v-if="question" class="mb-4 p-4 bg-gray-100">
      <pre>{{ JSON.stringify(question.answers, null, 2) }}</pre>
    </div> -->
  </div>
</template>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 