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
  privacyPolicyEn: ''
});
const formAr = ref({
  privacyPolicyAr: ''
});

const rulesEn: FormRules = {
  privacyPolicyEn: [{ required: true, message: t('setting.privacyPolicyEnRequired'), trigger: 'blur' }]
};
const rulesAr: FormRules = {
  privacyPolicyAr: [{ required: true, message: t('setting.privacyPolicyArRequired'), trigger: 'blur' }]
};
const message = useMessage()
async function updatePrivacyPolicyEn() {
  try {
    loadingEn.value = true;
    await settingStore.updatePrivacyPolicyEn(formEn.value.privacyPolicyEn);
    message.success(t('setting.updateSuccess'));
  } catch (error) {
    console.error('Failed to update English privacy policy', error);
    message.error(t('setting.updateFailed'));
  } finally {
    loadingEn.value = false;
  }
}

async function updatePrivacyPolicyAr() {
  try {
    loadingAr.value = true;
    await settingStore.updatePrivacyPolicyAr(formAr.value.privacyPolicyAr);
    message.success(t('setting.updateSuccess'));
  } catch (error) {
    console.error('Failed to update Arabic privacy policy', error);
    message.error(t('setting.updateFailed'));
  } finally {
    loadingAr.value = false;
  }
}

const isButtonDisabledEn = computed(() => {
  return loadingEn.value || !formEn.value.privacyPolicyEn;
});

const isButtonDisabledAr = computed(() => {
  return loadingAr.value || !formAr.value.privacyPolicyAr;
});

async function fetchData() {
  try {
    await settingStore.fetchPrivacyPolicyEn();
    await settingStore.fetchPrivacyPolicyAr();
    formEn.value.privacyPolicyEn = settingStore.$state.privacyPolicyEn || '';
    formAr.value.privacyPolicyAr = settingStore.$state.privacyPolicyAr || '';
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
    <div class="p-4 my-4 md:p-8 md:m-8 shadow-lg md:mx-20 border-none flex flex-col gap-2 rounded-lg">
        <div class="post-heading mb-1">
            <div class="gtext text-2xl font-bold underlined mb-8">
                {{ t('common.editPrivacyPolicy') }}
            </div>
        </div>
       
        <NCard
            title="Edit Privacy Policy"
            class="mb-4 md:mb-16"
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
                        class="px-2 md:px-4"
                    >
                        <NFormItem
                            path="privacyPolicyEn"
                            :label="t('common.privacyPolicyEn')"
                        >
                        <MdEditor
                          v-model="formEn.privacyPolicyEn"
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
                                @click="updatePrivacyPolicyEn"
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
                            path="privacyPolicyAr"
                            :label="t('common.privacyPolicyAr')"
                        >
                            <MdEditor
                                dir="rtl"
                                v-model="formAr.privacyPolicyAr"
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
                                @click="updatePrivacyPolicyAr"
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

