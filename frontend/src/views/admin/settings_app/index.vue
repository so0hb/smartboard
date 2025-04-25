<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NForm, NInput, NButton, FormInst, FormRules, NGrid, NFormItemGi, NSelect, useMessage, FormValidationError } from 'naive-ui'
import { t } from '@/locales'
import { useSettingStore, useModelStore } from '@/store'
import { isEmailValid } from '@/utils/functions'
import { useAppStore } from '@/store';
const appStore = useAppStore();
const span = appStore.getSpan();
const settingStore = useSettingStore()
const modelStore = useModelStore()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const models = ref<PublicApp.AppSetting>({ ...settingStore.settings } as PublicApp.AppSetting)

const rules: FormRules = {
  defaultMessage: [{ required: true, message: t('setting.defaultMessageRequired'), trigger: ['input', 'blur'] }],
  termsOfUseUrl: [{ required: true, message: t('setting.termsOfUseUrlRequired'), trigger: ['input', 'blur'] }],
  privacyPolicyUrl: [{ required: true, message: t('setting.privacyPolicyUrlRequired'), trigger: ['input', 'blur'] }],
  urlGooglplay: [{ required: false, message: t('setting.urlGooglplay'), trigger: ['input', 'blur'] }],
  urlAppstore: [{ required: false, message: t('setting.urlAppstore'), trigger: ['input', 'blur'] }],
  urlFacebook: [{ required: false, message: t('setting.urlFacebook'), trigger: ['input', 'blur'] }],
  urlYoutube: [{ required: false, message: t('setting.urlYoutube'), trigger: ['input', 'blur'] }],
  urlWhatsapp: [{ required: false, message: t('setting.urlWhatsapp'), trigger: ['input', 'blur'] }],
  email: [{ required: false, message: t('setting.email'), trigger: ['input', 'blur'] }],
  urlInstagram: [{ required: false, message: t('setting.urlInstagram'), trigger: ['input', 'blur'] }],
  urlTiktok: [{ required: false, message: t('setting.urlTiktok'), trigger: ['input', 'blur'] }],
  phoneNumber: [{ required: false, message: t('setting.phoneNumber'), trigger: ['input', 'blur'] }],
  version: [{ required: false, message: t('setting.versionApp'), trigger: ['input', 'blur'] }] 
}

async function handleUpdateSettings() {
  try {
    loading.value = true
    await settingStore.updateDataAction(model.value)
    loading.value = false
    message.success(t('setting.updateSuccess'))
  } catch (error: any) {
    loading.value = false
    console.error(t('setting.updateFailed'), error.message)
    message.error(t('setting.updateFailed'))
  }
}



function handleValidateButtonClick(e: MouseEvent) {

e.preventDefault();
formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {

        // Perform custom validation
        if (model.value.email && !isEmailValid(model.value.email!)) {
            message.error(t('auth.invalidEmailFormat'));
            loading.value = false;
            return;
        }

      
        else {
            loading.value = true
            handleUpdateSettings();
        }

    } else {
        // console.log(errors);
        message.error(t('setting.fillAllFields'))
        loading.value = false
    }
});
}

const isButtonDisabled = computed(() => {
  return loading.value 
})

const aiModels = ref<Array<{ label: string; value: string }>>([])

async function fetchData(): Promise<void> {
  try {
    await settingStore.fetchDataAction()
    await modelStore.fetchDataAction({ limit: 1000, offset: 0 })
    aiModels.value = modelStore.listData
      .filter(model => model.isActivate) 
      .map(model => ({
        label: model.name,
        value: model.id as string,
      }));
    model.value = { ...settingStore.settings } as PublicApp.AppSetting
  } catch (error: any) {
    console.error(t('setting.dataFetchError'), error.message)
  }
}

onMounted(fetchData)


const model = ref({
  id: '',
  theme: 'light',
  language: 'en-US',
  emailsSupport: '',
  emailDeveloper: '',
  phoneNumber: '',
  isModelAction: false,
  labelPlacement: 'top',
  span: 1,
  columnGrid: 1,
  applicationSettings: {
    nameApp: '',
    logoUrl: '',
    defaultTheme: 'light',
    defaultLanguage: 'en-US',
    authOption: {
      email: false,
      isCode: false,
      google: false,
      facebook: false
    },
    links: {
      googlePlay: '',
      applestore: '',
      facebook: '',
      youtube: '',
      whatsapp: '',
      instagram: '',
      tiktok: '',
      privacyPolicy: '',
      termsOfUse: ''
    },
    systemMessage: '',
    temperature: 0.7,
    top_p: 1,
    isEmojis: false
  },
  createdAt: '',
  updatedAt: ''
})

const saveSettings = () => {
  // Here you would typically send the settings to your backend
  console.log('Settings saved:')
  // You can add your API call or state management logic here
}

import { BaseInput, BaseSelect, BaseSwitch, BaseInputNumber } from '@/components/common';

const themeOptions = [
  { label: t('common.light'), value: 'light' },
  { label: t('common.dark'), value: 'dark' },
  { label: t('common.auto'), value: 'auto' }
]

const languageOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: '简体中文', value: 'zh-CN' },
  { label: 'العربية (الجزائر)', value: 'ar-DZ' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '한국어', value: 'ko-KR' },
  { label: 'Русский', value: 'ru-RU' }
]

const labelPlacementOptions = [
  { label: t('common.top'), value: 'top' },
  { label: t('common.left'), value: 'left' }
]

const handleUploadSuccess = (fileName: string) => {
  // model.value.logoUrl = fileName;
  message.success('File uploaded successfully');
};

const generalFormRef = ref(null)
const authFormRef = ref(null)
const linksFormRef = ref(null)
const aiFormRef = ref(null)

const handleGeneralSubmit = () => {

}
const handleAuthSubmit = () => {

}

const handleLinksSubmit = () => {

}

const handleAISubmit = () => {

}
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {{ t('common.dashboardSettings') }}
      </h1>
      
      <NTabs type="line" animated>
        <!-- General Settings Tab -->
        <NTabPane name="general" :tab="t('common.generalSettings')">
          <NForm ref="generalFormRef" :model="model" :rules="rules" size="large">
            <NGrid :x-gap="24" :y-gap="24" :cols="24">
              <NFormItemGi :span="12" path="applicationSettings.nameApp" :label="t('common.appName')">
                <NInput v-model:value="model.applicationSettings.nameApp" :placeholder="t('common.appName')" />
              </NFormItemGi>
              <NFormItemGi :span="12" path="logoUrl" :label="t('common.logoUrl')">
                <BaseUpload bucket="company" @upload-success="handleUploadSuccess" />
              </NFormItemGi>
              <NFormItemGi :span="12" path="applicationSettings.defaultTheme" :label="t('common.defaultTheme')">
                <NSelect v-model:value="model.applicationSettings.defaultTheme" :options="themeOptions" />
              </NFormItemGi>
              <NFormItemGi :span="12" path="applicationSettings.defaultLanguage" :label="t('common.defaultLanguage')">
                <NSelect v-model:value="model.applicationSettings.defaultLanguage" :options="languageOptions" />
              </NFormItemGi>
            </NGrid>
            <div class="mt-6 flex justify-end">
              <NButton type="primary" @click="handleValidateButtonClick">
                {{ t('common.confirm') }}
              </NButton>
            </div>
          </NForm>
        </NTabPane>

        <!-- Auth Settings Tab -->
        <NTabPane name="auth" :tab="t('common.authSettings')">
          <NForm ref="authFormRef" :model="model" :rules="rules" size="large">
            <NGrid :x-gap="24" :y-gap="24" :cols="24">
              <NFormItemGi :span="24" :label="t('common.authOptions')">
                <NSpace>
                  <NCheckbox v-model:checked="model.applicationSettings.authOption.email">
                    {{ t('common.emailAuth') }}
                  </NCheckbox>
                  <NCheckbox v-model:checked="model.applicationSettings.authOption.isCode">
                    {{ t('common.codeAuth') }}
                  </NCheckbox>
                  <NCheckbox v-model:checked="model.applicationSettings.authOption.google">
                    {{ t('common.googleAuth') }}
                  </NCheckbox>
                  <NCheckbox v-model:checked="model.applicationSettings.authOption.facebook">
                    {{ t('common.facebookAuth') }}
                  </NCheckbox>
                </NSpace>
              </NFormItemGi>
            </NGrid>
            <div class="mt-6 flex justify-end">
              <NButton type="primary" @click="handleValidateButtonClick">
                {{ t('common.confirm') }}
              </NButton>
            </div>
          </NForm>
        </NTabPane>

        <!-- Links Tab -->
        <NTabPane name="links" :tab="t('common.links')">
          <NForm ref="linksFormRef" :model="model" :rules="rules" size="large">
            <NGrid :x-gap="24" :y-gap="24" :cols="24">
              <NFormItemGi 
                v-for="(value, key) in model.applicationSettings.links" 
                :key="key" 
                :span="12" 
                :path="`applicationSettings.links.${key}`" 
                :label="t(`common.${key}`)"
              >
                <NInput v-model:value="model.applicationSettings.links[key]" :placeholder="t(`common.${key}`)" />
              </NFormItemGi>
            </NGrid>
            <div class="mt-6 flex justify-end">
              <NButton type="primary" @click="handleValidateButtonClick">
                {{ t('common.confirm') }}
              </NButton>
            </div>
          </NForm>
        </NTabPane>

        <!-- AI Settings Tab -->
        <NTabPane name="ai" :tab="t('common.aiSettings')">
          <NForm ref="aiFormRef" :model="model" :rules="rules" size="large">
            <NGrid :x-gap="24" :y-gap="24" :cols="24">
              <NFormItemGi :span="24" path="defaultAiModel" :label="t('setting.defaultAiModel')">
                <NSelect
                  v-model:value="model.id"
                  :options="aiModels"
                  :placeholder="t('setting.selectDefaultModel')"
                  clearable
                />
              </NFormItemGi>
              <NFormItemGi :span="24" path="applicationSettings.systemMessage" :label="t('common.systemMessage')">
                <NInput 
                  v-model:value="model.applicationSettings.systemMessage" 
                  type="textarea" 
                  :placeholder="t('common.systemMessage')" 
                />
              </NFormItemGi>
              <NFormItemGi :span="8" path="applicationSettings.temperature" :label="t('common.temperature')">
                <NInputNumber 
                  v-model:value="model.applicationSettings.temperature" 
                  :min="0" 
                  :max="1" 
                  :step="0.1" 
                />
              </NFormItemGi>
              <NFormItemGi :span="8" path="applicationSettings.top_p" :label="t('common.topP')">
                <NInputNumber 
                  v-model:value="model.applicationSettings.top_p" 
                  :min="0" 
                  :max="1" 
                  :step="0.1" 
                />
              </NFormItemGi>
              <NFormItemGi :span="8" path="applicationSettings.isEmojis" :label="t('common.enableEmojis')">
                <NSwitch v-model:value="model.applicationSettings.isEmojis" />
              </NFormItemGi>
            </NGrid>
            <div class="mt-6 flex justify-end">
              <NButton type="primary" @click="handleValidateButtonClick">
                {{ t('common.confirm') }}
              </NButton>
            </div>
          </NForm>
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>


<!-- <template>
   <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Settings</h1>
      
      <NForm
    ref="formRef"
    :model="model"
    :rules="rules"
    size="large"
  >
    <NGrid :x-gap="24" :y-gap="24" :cols="24">
    
    
      <NFormItemGi :span="12" path="applicationSettings.nameApp" :label="t('common.appName')">
        <NInput v-model:value="model.applicationSettings.nameApp" :placeholder="t('common.appName')" />
      </NFormItemGi>
      <NFormItemGi
          :span="12"
          path="logoUrl"
          :label="t('common.logoUrl')"
        >
          <BaseUpload
            bucket="company"
            @upload-success="handleUploadSuccess"
          />
        </NFormItemGi>
      <NFormItemGi :span="12" path="applicationSettings.defaultTheme" :label="t('common.defaultTheme')">
        <NSelect v-model:value="model.applicationSettings.defaultTheme" :options="themeOptions" />
      </NFormItemGi>
      <NFormItemGi :span="12" path="applicationSettings.defaultLanguage" :label="t('common.defaultLanguage')">
        <NSelect v-model:value="model.applicationSettings.defaultLanguage" :options="languageOptions" />
      </NFormItemGi>

   
      <NFormItemGi :span="24" :label="t('common.authOptions')">
        <NSpace>
          <NCheckbox v-model:checked="model.applicationSettings.authOption.email">
            {{ t('common.emailAuth') }}
          </NCheckbox>
          <NCheckbox v-model:checked="model.applicationSettings.authOption.isCode">
            {{ t('common.codeAuth') }}
          </NCheckbox>
          <NCheckbox v-model:checked="model.applicationSettings.authOption.google">
            {{ t('common.googleAuth') }}
          </NCheckbox>
          <NCheckbox v-model:checked="model.applicationSettings.authOption.facebook">
            {{ t('common.facebookAuth') }}
          </NCheckbox>
        </NSpace>
      </NFormItemGi>

    
      <NFormItemGi v-for="(value, key) in model.applicationSettings.links" :key="key" :span="12" :path="`applicationSettings.links.${key}`" :label="t(`common.${key}`)">
        <NInput v-model:value="model.applicationSettings.links[key]" :placeholder="t(`common.${key}`)" />
      </NFormItemGi>

   
      <NFormItemGi :span="span" path="defaultAiModel" :label="t('setting.defaultAiModel')">
            <NSelect
              v-model:value="model.id"
              :options="aiModels"
              :placeholder="t('setting.selectDefaultModel')"
              clearable
            />
          </NFormItemGi>
      <NFormItemGi :span="24" path="applicationSettings.systemMessage" :label="t('common.systemMessage')">
        <NInput v-model:value="model.applicationSettings.systemMessage" type="textarea" :placeholder="t('common.systemMessage')" />
      </NFormItemGi>
      <NFormItemGi :span="8" path="applicationSettings.temperature" :label="t('common.temperature')">
        <NInputNumber v-model:value="model.applicationSettings.temperature" :min="0" :max="1" :step="0.1" />
      </NFormItemGi>
      <NFormItemGi :span="8" path="applicationSettings.top_p" :label="t('common.topP')">
        <NInputNumber v-model:value="model.applicationSettings.top_p" :min="0" :max="1" :step="0.1" />
      </NFormItemGi>
      <NFormItemGi :span="8" path="applicationSettings.isEmojis" :label="t('common.enableEmojis')">
        <NSwitch v-model:value="model.applicationSettings.isEmojis" />
      </NFormItemGi>
    </NGrid>
  </NForm>
    </div>
  </div>
  </template> -->