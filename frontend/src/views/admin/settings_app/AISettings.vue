<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useMessage } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import axios from 'axios'
import { baseURL } from '@/utils/request/axios'
import { t } from '@/locales'

interface AISettings {
  id: number
  provider: 'openai' | 'huggingface'
  is_active: boolean
  openai_api_key?: string
  huggingface_api_key?: string
  created_at: string
  updated_at: string
}

const message = useMessage()
const loading = ref(false)
const saving = ref(false)
const settings = ref<AISettings[]>([])
const currentSetting = ref<AISettings | null>(null)

const showModal = ref(false)
const formRef = ref(null)

const rules = {
  provider: {
    required: true,
    message: t('settings.providerRequired'),
    trigger: ['blur', 'change']
  },
  api_key: {
    required: true,
    message: t('settings.apiKeyRequired'),
    trigger: ['blur', 'change']
  }
}

const providerOptions = [
  {
    label: 'OpenAI',
    value: 'openai'
  },
  {
    label: 'Hugging Face',
    value: 'huggingface'
  }
]

const currentApiKey = computed<string>({
  get: () => {
    if (!currentSetting.value) return ''
    return currentSetting.value.provider === 'openai' 
      ? currentSetting.value.openai_api_key ?? ''
      : currentSetting.value.huggingface_api_key ?? ''
  },
  set: (value: string) => {
    if (!currentSetting.value) return
    if (currentSetting.value.provider === 'openai') {
      currentSetting.value.openai_api_key = value
    } else {
      currentSetting.value.huggingface_api_key = value
    }
  }
})

const loadSettings = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${baseURL}discussions/ai-settings/`)
    settings.value = response.data.results || []
  } catch (error: any) {
    message.error(error.message || t('common.loadError'))
  } finally {
    loading.value = false
  }
}

const createSetting = () => {
  currentSetting.value = {
    id: 0,
    provider: 'openai',
    is_active: true,
    openai_api_key: '',
    huggingface_api_key: '',
    created_at: '',
    updated_at: ''
  }
  showModal.value = true
}

const editSetting = async (setting: AISettings) => {
  try {
    // Get the actual API key
    const response = await axios.get(`${baseURL}discussions/ai-settings/${setting.id}/get_api_key/`)
    const apiKey = response.data.api_key

    currentSetting.value = { 
      ...setting,
      // Set the appropriate API key
      openai_api_key: setting.provider === 'openai' ? apiKey : '',
      huggingface_api_key: setting.provider === 'huggingface' ? apiKey : ''
    }
    showModal.value = true
  } catch (error: any) {
    console.error('Error fetching API key:', error)
    message.error(t('settings.errorFetchingKey'))
  }
}

const verifyApiKey = async (provider: string, apiKey: string) => {
  try {
    const response = await axios.post(`${baseURL}discussions/ai-settings/verify/`, {
      provider,
      api_key: apiKey
    })
    
    if (response.data.valid) {
      message.success(t('settings.apiKeyVerified'))
      return true
    } else {
      message.error(response.data.error || t('settings.invalidApiKey'))
      return false
    }
  } catch (error: any) {
    console.error('API key verification error:', error.response?.data || error.message)
    message.error(
      error.response?.data?.error || 
      error.message || 
      t('settings.verificationFailed')
    )
    return false
  }
}

const handleSubmit = async () => {
  if (!currentSetting.value) return
  if (!currentApiKey.value) {
    message.error(t('settings.apiKeyRequired'))
    return
  }

  try {
    saving.value = true
    const isNew = !currentSetting.value.id

    // Show testing message
    message.loading(t('settings.testingApiKey'))

    // First verify the API key
    // const isValid = await verifyApiKey(currentSetting.value.provider, currentApiKey.value)
    // if (!isValid) {
    //   return
    // }

    const data = {
      provider: currentSetting.value.provider,
      is_active: currentSetting.value.is_active,
      openai_api_key: currentSetting.value.provider === 'openai' ? currentApiKey.value : null,
      huggingface_api_key: currentSetting.value.provider === 'huggingface' ? currentApiKey.value : null
    }

    const response = await axios({
      method: isNew ? 'post' : 'put',
      url: `${baseURL}discussions/ai-settings/${isNew ? '' : currentSetting.value.id + '/'}`,
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data) {
      message.success(t(isNew ? 'settings.createSuccess' : 'settings.updateSuccess'))
      showModal.value = false
      await loadSettings()
    }
  } catch (error: any) {
    console.error('AI Settings Error:', error.response?.data || error.message)
    message.error(
      error.response?.data?.error || 
      error.response?.data?.detail || 
      error.message || 
      t('common.saveError')
    )
  } finally {
    saving.value = false
  }
}

const deleteSetting = async (id: number) => {
  try {
    await axios.delete(`${baseURL}discussions/ai-settings/${id}/`)
    message.success(t('settings.deleteSuccess'))
    await loadSettings()
  } catch (error: any) {
    message.error(error.message || t('common.deleteError'))
  }
}

const validateSetting = (setting: AISettings): boolean => {
  if (!setting.provider) {
    message.error(t('settings.providerRequired'))
    return false
  }
  
  const apiKey = setting.provider === 'openai' ? setting.openai_api_key : setting.huggingface_api_key
  if (!apiKey) {
    message.error(t('settings.apiKeyRequired'))
    return false
  }
  
  return true
}

const validateApiKey = async () => {
  if (!currentApiKey.value || !currentSetting.value) return

  try {
    const isValid = await verifyApiKey(currentSetting.value.provider, currentApiKey.value)
    if (!isValid) {
      message.warning(t('settings.invalidApiKey'))
    }
  } catch (error) {
    console.error('API key validation error:', error)
  }
}

// Add computed property to check if API key is masked
const isApiKeyMasked = computed(() => {
  return currentApiKey.value === '********'
})

// Add method to handle API key changes
const handleApiKeyChange = (value: string) => {
  if (value !== '********') {
    currentApiKey.value = value
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">{{ t('settings.aiSettings') }}</h1>
      <NButton type="primary" @click="createSetting">
        {{ t('settings.createNew') }}
      </NButton>
    </div>

    <NSpin :show="loading">
      <NResult
        v-if="!loading && settings.length === 0"
        status="info"
        :title="t('settings.noAISettings')"
        :description="t('settings.noAISettingsDesc')"
      >
        <template #footer>
          <NButton type="primary" @click="createSetting">
            {{ t('settings.createFirst') }}
          </NButton>
        </template>
      </NResult>

      <div v-else class="grid gap-4">
        <NCard
          v-for="setting in settings"
          :key="setting.id"
          class="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-semibold capitalize">
                  {{ setting.provider }}
                </h3>
                <NTag :type="setting.is_active ? 'success' : 'default'" size="small">
                  {{ setting.is_active ? t('common.active') : t('common.inactive') }}
                </NTag>
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ t('settings.lastUpdated') }}: 
                <NTime :time="new Date(setting.updated_at)" />
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ setting.provider === 'openai' ? 'OpenAI' : 'Hugging Face' }} 
                {{ t('settings.apiConfigured') }}
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <NButtonGroup>
                <NButton 
                  @click="editSetting(setting)"
                  class="flex items-center gap-1"
                >
                  <SvgIcon name="mdi:pencil" class="text-lg" />
                  {{ t('common.edit') }}
                </NButton>
                <NPopconfirm 
                  @confirm="deleteSetting(setting.id)"
                  :negative-text="t('common.cancel')"
                  :positive-text="t('common.delete')"
                >
                  <template #trigger>
                    <NButton type="error" class="flex items-center gap-1">
                      <SvgIcon name="mdi:delete" class="text-lg" />
                      {{ t('common.delete') }}
                    </NButton>
                  </template>
                </NPopconfirm>
              </NButtonGroup>
            </div>
          </div>
        </NCard>
      </div>
    </NSpin>

    <NModal v-model:show="showModal">
      <NCard
        :title="currentSetting?.id ? t('settings.editAISettings') : t('settings.createAISettings')"
        class="w-[600px]"
      >
        <NForm
          ref="formRef"
          :model="currentSetting"
          :rules="rules"
          label-placement="left"
          label-width="120"
          require-mark-placement="right-hanging"
        >
          <NFormItem :label="t('settings.provider')" path="provider">
            <NSelect
              v-model:value="currentSetting!.provider"
              :options="providerOptions"
            />
          </NFormItem>

          <NFormItem
            :label="currentSetting?.provider === 'openai' ? 'OpenAI API Key' : 'Hugging Face API Key'"
            path="api_key"
            required
          >
            <NInput
              v-model:value="currentApiKey"
              type="password"
              show-password-on="click"
              :placeholder="isApiKeyMasked ? 'Enter new API key to update' : t('settings.enterApiKey')"
              @update:value="handleApiKeyChange"
              @blur="validateApiKey"
            />
            <template #help>
              <span class="text-gray-500">
                {{ isApiKeyMasked 
                  ? t('settings.leaveBlankToKeepCurrent') 
                  : t('settings.apiKeyHelp') 
                }}
              </span>
            </template>
          </NFormItem>

          <NFormItem :label="t('common.status')">
            <NSwitch v-model:value="currentSetting!.is_active">
              <template #checked>
                {{ t('common.active') }}
              </template>
              <template #unchecked>
                {{ t('common.inactive') }}
              </template>
            </NSwitch>
          </NFormItem>
        </NForm>

        <template #footer>
          <div class="flex justify-end gap-2">
            <NButton @click="showModal = false">
              {{ t('common.cancel') }}
            </NButton>
            <NButton
              type="primary"
              :loading="saving"
              @click="handleSubmit"
            >
              {{ t('common.save') }}
            </NButton>
          </div>
        </template>
      </NCard>
    </NModal>
  </div>
</template>

<style scoped>
.n-card {
  transition: all 0.3s ease;
}

.n-card:hover {
  transform: translateY(-2px);
}
</style> 