<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { NForm, NButton, FormRules, NCard, NTabs, NTabPane, NFormItem } from 'naive-ui';
import { useSettingStore } from '@/store';
import { t } from '@/locales';
import { MdEditor } from 'md-editor-v3';
import type { ExposeParam } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const editorRef = ref<ExposeParam>();
const settingStore = useSettingStore();
const formRefEn = ref(null);
const formRefAr = ref(null);
const loadingEn = ref(false);
const loadingAr = ref(false);

const formEn = ref({
  termsOfUseEn: ''
});
const formAr = ref({
  termsOfUseAr: ''
});

const rulesEn: FormRules = {
  termsOfUseEn: [{ required: true, message: t('setting.termsOfUseEnRequired'), trigger: 'blur' }]
};
const rulesAr: FormRules = {
  termsOfUseAr: [{ required: true, message: t('setting.termsOfUseArRequired'), trigger: 'blur' }]
};

const message = useMessage()

async function updateTermsOfUseEn() {
  try {
    loadingEn.value = true;
    await settingStore.updateTermsOfUseEn(formEn.value.termsOfUseEn);
    message.success(t('setting.updateSuccess'));
  } catch (error) {
    console.error('Failed to update English terms of use', error);
    message.error(t('setting.updateFailed'));
  } finally {
    loadingEn.value = false;
  }
}

async function updateTermsOfUseAr() {
  try {
    loadingAr.value = true;
    await settingStore.updateTermsOfUseAr(formAr.value.termsOfUseAr);
    message.success(t('setting.updateSuccess'));
  } catch (error) {
    console.error('Failed to update Arabic terms of use', error);
    message.error(t('setting.updateFailed'));
  } finally {
    loadingAr.value = false;
  }
}

const isButtonDisabledEn = computed(() => {
  return loadingEn.value || !formEn.value.termsOfUseEn;
});

const isButtonDisabledAr = computed(() => {
  return loadingAr.value || !formAr.value.termsOfUseAr;
});

async function fetchData() {
  try {
    await settingStore.fetchTermsOfUseEn();
    await settingStore.fetchTermsOfUseAr();
    formEn.value.termsOfUseEn = settingStore.$state.termsOfUseEn || '';
    formAr.value.termsOfUseAr = settingStore.$state.termsOfUseAr || '';
  } catch (error: any) {
    console.error(t('setting.dataFetchError'), error.message);
    message.error(t('setting.dataFetchError'));
  }
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="p-8 m-8 shadow-lg mx-20 border-none flex flex-col gap-2 rounded-lg">
    <div class="post-heading mb-1">
      <div class="gtext text-2xl font-bold underlined mb-8">
        {{ t('common.editTermsOfUse') }}
      </div>
    </div>
    
    <NCard
      title="Edit Terms of Use"
      style="margin-bottom: 16px"
    >
      <NTabs
        type="line"
        animated
      >
        <NTabPane
          name="english"
          tab="English"
        >
          <NForm
            :model="formEn"
            :rules="rulesEn"
            ref="formRefEn"
          >
            <NFormItem
              path="termsOfUseEn"
              :label="t('common.termsOfUseEn')"
            >
              <MdEditor
                v-model="formEn.termsOfUseEn"
                ref="editorRef"
                style="min-height: 300px;"
              />
            </NFormItem>
            <div class="mt-4">
              <NButton
                type="primary"
                style="width: 100%;"
                size="large"
                :loading="loadingEn"
                :disabled="isButtonDisabledEn"
                @click="updateTermsOfUseEn"
              >
                {{ t('common.save') }}
              </NButton>
            </div>
          </NForm>
        </NTabPane>
        <NTabPane
          name="arabic"
          tab="Arabic"
        >
          <NForm
            :model="formAr"
            :rules="rulesAr"
            ref="formRefAr"
          >
            <NFormItem
              path="termsOfUseAr"
              :label="t('common.termsOfUseAr')"
            >
              <MdEditor
                dir="rtl"
                v-model="formAr.termsOfUseAr"
                style="min-height: 300px;"
              />
            </NFormItem>
            <div class="mt-4">
              <NButton
                type="primary"
                style="width: 100%;"
                size="large"
                :loading="loadingAr"
                :disabled="isButtonDisabledAr"
                @click="updateTermsOfUseAr"
              >
                {{ t('common.save') }}
              </NButton>
            </div>
          </NForm>
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>
  
