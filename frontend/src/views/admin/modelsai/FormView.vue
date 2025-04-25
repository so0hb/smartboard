<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FormInst, FormRules } from 'naive-ui';
import { t } from '@/locales';
import { useCompanyStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { getImageUrl } from '@/utils/supabaseHelper';
import { BaseInput, BaseSelect, BaseSwitch, BaseInputNumber } from '@/components/common';
const { isMobile } = useBasicLayout();
const span = computed(() => (isMobile ? 24 : 12));
const props = defineProps<{
  initialModel: API.ModelAI;
  objStore: Object,

}>();
const companyStore = useCompanyStore();
const model = toRef(props, 'initialModel');
const formRef = ref<FormInst | null>(null);
const rules: FormRules = {
  name: [{ required: true, message: t('common.nameRequired'), trigger: ['input', 'blur'] }],
  modelCode: [{ required: true, message: t('common.modelCodeRequired'), trigger: ['input', 'blur'] }],
  companyId: [{ required: true, message: t('common.companyIdRequired'), trigger: ['input', 'blur'] }],
};
const dataOptions = [
  { label: t('common.text'), value: 'Text' },
  { label: t('common.image'), value: 'Image' },
  { label: t('common.audio'), value: 'Audio' },
  { label: t('common.video'), value: 'Video' },
  { label: t('common.documents'), value: 'Documents' }
];

const companies = ref<any[]>([]);

async function fetchData(): Promise<void> {
  try {
    await companyStore.fetchDataAction({ limit: 1000, offset: 0 });
    console.log(typeof (companyStore))
    companyStore.listData = await Promise.all(companyStore.listData.map(async (company) => {
      if (company.logoUrl) {
        try {
          company.logoUrl = await getImageUrl(companyStore.bucket, company.logoUrl);
        } catch (error) {
          console.error(`Failed to fetch image for company ${company.name}:`, error);
        }
      }
      return { ...company };
    }));

    companies.value = companyStore.listData.map(company => ({
      label: company.name,
      value: company.id,
      logoUrl: company.logoUrl
    }));
  } catch (error: any) {
    console.error(t('chat.dataFetchError'), error.message);
  }
}


onMounted(() => {
  fetchData()
  emit('formMounted', formRef.value);
});


const emit = defineEmits(['handleValidateButtonClick', 'formMounted']);


</script>

<template>

  <NForm
    ref="formRef"
    :model="model"
    :rules="rules"
    size="large"
  >
    <div>
      <NGrid>
        <NFormItemGi
          :span="span"
          path="companyId"
          :label="t('common.company')"
        >
          <BaseSelect
            v-model="model.companyId"
            :placeholder="t('common.selectCompany')"
            :options="companies"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="name"
          :label="t('common.name')"
        >
          <BaseInput
            v-model="model.name"
            :placeholder="t('common.name')"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
          />
        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="modelCode"
          :label="t('common.modelCode')"
        >
          <BaseInput
            v-model="model.modelCode"
            :placeholder="t('common.modelCode')"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="description"
          :label="t('common.description')"
        >
          <BaseInput
            v-model="model.description"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
            :placeholder="t('common.description')"
            type="textarea"
          />
        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="version"
          :label="t('common.version')"
        >
          <BaseInput
            v-model="model.version"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
            :placeholder="t('common.version')"
          />
        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="inputData"
          :label="t('common.inputData')"
        >
          <BaseSelect
            v-model="model.inputData"
            :options="dataOptions"
            multiple
            :placeholder="t('common.selectInputData')"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="outputData"
          :label="t('common.outputData')"
        >
          <BaseSelect
            v-model="model.outputData"
            :options="dataOptions"
            multiple
            :placeholder="t('common.selectOutputData')"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="12"
          path="maxTokens"
          :label="t('common.maxTokens')"
        >
          <NInputNumber
            v-model="model.maxTokens"
            :placeholder="t('common.maxTokens')"
          />
        </NFormItemGi>
        <NFormItemGi
          :span="12"
          path="temperature"
          :label="t('common.temperature')"
        >
          <BaseInputNumber
            v-model="model.temperature"
            :placeholder="t('common.temperature')"
          />
        </NFormItemGi>
        <NFormItemGi
          :span="12"
          path="topP"
          :label="t('common.topP')"
        >
          <BaseInputNumber
            v-model="model.topP"
            :placeholder="t('common.topP')"
            :max=40
          />

        </NFormItemGi>
        <NFormItemGi
          :span="12"
          path="topK"
          :label="t('common.topK')"
        >
          <BaseInputNumber
            v-model="model.topK"
            :placeholder="t('common.topK')"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="12"
          path="repetitionPenalty"
          :label="t('common.repetitionPenalty')"
        >
          <BaseInputNumber
            v-model="model.repetitionPenalty"
            :placeholder="t('common.repetitionPenalty')"
          />


        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="stop"
          :label="t('common.stop')"
        >
          <BaseInput
            v-model="model.stop"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
            :placeholder="t('common.stopPlaceholder')"
            type="textarea"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="stream"
          :label="t('common.stream')"
        >
          <BaseSwitch v-model:value="model.stream" />
        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="isActivate"
          :label="t('common.isActivate')"
        >
          <BaseSwitch v-model:value="model.isActivate" />
        </NFormItemGi>
      </NGrid>


    </div>
  </NForm>
</template>
