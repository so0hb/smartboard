<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { t } from '@/locales'
import { useRouter } from 'vue-router'
import { useQuestionsStore } from '@/store/modules/questions'

const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const loading = ref(false)
const questionsStore = useQuestionsStore()

async function fetchQuestions() {
  try {
    loading.value = true
    await questionsStore.fetchQuestions()
  } catch (error) {
    message.error(t('common.errorSomeThing'))
  } finally {
    loading.value = false
  }
}

function handleViewDetails(questionId: string) {
  router.push(`/admin/questions/${questionId}`)
}

async function handleDelete(questionId: string) {
  dialog.warning({
    title: t('common.confirmDelete'),
    content: t('common.deleteConfirmMessage'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        await questionsStore.deleteQuestion(questionId)
        message.success(t('common.deleteSuccess'))
      } catch (error) {
        message.error(t('common.deleteFailed'))
      }
    }
  })
}

onMounted(() => {
  fetchQuestions()
})
const userStore = useUserStore()
const userInfo = computed(() => userStore.$state.user!!)
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">{{ t('common.Questions') }}</h2>
      <NButton type="primary" @click="router.push('/admin/submit-question')">
        {{ t('common.submitNewQuestion') }}
      </NButton>
    </div>

    <div v-if="loading" class="flex justify-center">
      <NSpin size="large" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NCard v-for="question in questionsStore.listData" :key="question.id" class="hover:shadow-lg transition-shadow">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">{{ question.title }}</h3>
            <NTag :type="question.category === 'technical' ? 'info' : 'success'">
              {{ question.category }}
            </NTag>
          </div>
        </template>

        <p class="line-clamp-3">{{ question.content }}</p>

        <template #footer>
          <div class="flex justify-between items-center">
            <NTime :time="new Date(question.createdAt)" />
            <div class="space-x-2">
              <NButton size="small" @click="handleViewDetails(question.id)">
                {{ t('common.view') }}
              </NButton>
              <NButton v-if="userStore.user?.role === 'admin'" size="small" type="error" @click="handleDelete(question.id)">
                {{ t('common.delete') }}
              </NButton>
            </div>
          </div>
        </template>
      </NCard>
    </div>
  </div>
</template> 