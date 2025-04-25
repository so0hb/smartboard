


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NForm, NInput, NButton, FormInst, FormRules, NGrid, NFormItemGi, NSelect, useMessage, FormValidationError } from 'naive-ui'
import { t } from '@/locales'
import { useSettingStore, useModelStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { isEmailValid } from '@/utils/functions'

const { isMobile } = useBasicLayout()
const span = computed(() => (isMobile.value ? 24 : 24))

const settingStore = useSettingStore()
const modelStore = useModelStore()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const model = ref<PublicApp.AppSetting>({ ...settingStore.settings } as PublicApp.AppSetting)

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
  return loading.value || !model.value.defaultMessage || !model.value.termsOfUseUrl || !model.value.privacyPolicyUrl
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
</script>


<template>
  <!-- <div class="container_dashboard">
    <div class="header_dashboard">
      {{ t('setting.title')  }}
    </div>
</div> -->
<div class="p-8  md:m-8 shadow-lg lg:mx-20 border-none  flex flex-col gap-2  rounded-lg">
            <div class="post-heading mb-1">
      <div class="gtext text-2xl font-bold underlined mb-8">   {{ t('setting.title')  }}</div>
    </div>
  <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      size="large"
    >
    <NGrid >
          <NFormItemGi :span="span" path="defaultAiModel" :label="t('setting.defaultAiModel')">
            <NSelect
              v-model:value="model.defaultAiModel.id"
              :options="aiModels"
              :placeholder="t('setting.selectDefaultModel')"
              clearable
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="defaultMessage" :label="t('setting.defaultMessage')">
            <NInput
              v-model:value="model.defaultMessage"
              :placeholder="t('setting.defaultMessage')"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="termsOfUseUrl" :label="t('setting.termsOfUseUrl')">
            <NInput
              v-model:value="model.termsOfUseUrl"
              :placeholder="t('setting.termsOfUseUrl')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="privacyPolicyUrl" :label="t('setting.privacyPolicyUrl')">
            <NInput
              v-model:value="model.privacyPolicyUrl"
              :placeholder="t('setting.privacyPolicyUrl')"
            />
          </NFormItemGi>
          <!-- Added new fields -->
          <NFormItemGi :span="span" path="urlGooglplay" :label="t('setting.urlGooglplay')">
            <NInput
              v-model:value="model.urlGooglplay"
              :placeholder="t('setting.urlGooglplay')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="urlAppstore" :label="t('setting.urlAppstore')">
            <NInput
              v-model:value="model.urlAppstore"
              :placeholder="t('setting.urlAppstore')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="urlFacebook" :label="t('setting.urlFacebook')">
            <NInput
              v-model:value="model.urlFacebook"
              :placeholder="t('setting.urlFacebook')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="urlYoutube" :label="t('setting.urlYoutube')">
            <NInput
              v-model:value="model.urlYoutube"
              :placeholder="t('setting.urlYoutube')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="urlWhatsapp" :label="t('setting.urlWhatsapp')">
            <NInput
              v-model:value="model.urlWhatsapp"
              :placeholder="t('setting.urlWhatsapp')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="email" :label="t('setting.email')">
            <NInput
              v-model:value="model.email"
              :placeholder="t('setting.email')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="urlInstagram" :label="t('setting.urlInstagram')">
            <NInput
              v-model:value="model.urlInstagram"
              :placeholder="t('setting.urlInstagram')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="urlTiktok" :label="t('setting.urlTiktok')">
            <NInput
              v-model:value="model.urlTiktok"
              :placeholder="t('setting.urlTiktok')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="phoneNumber" :label="t('setting.phoneNumber')">
            <NInput
              v-model:value="model.phoneNumber"
              :placeholder="t('setting.phoneNumber')"
            />
          </NFormItemGi>
          <NFormItemGi :span="span" path="version" :label="t('setting.versionApp')">
          <NInput
            v-model:value="model.version"
            :placeholder="t('setting.versionApp')"
          />
        </NFormItemGi>
        </NGrid>
      <div class="mt-4">
        <NButton
          type="primary"
          style="width: 100%;"
          size="large"
          :loading="loading"
          :disabled="isButtonDisabled"
          @click="handleValidateButtonClick"
        >
          {{ t('setting.update') }}
        </NButton>
      </div>
    </NForm> 
  </div>
</template>