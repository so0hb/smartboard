<script setup lang="ts">
import { t } from '@/locales';
import { useAppStore } from '@/store';
import { generateValidationRules } from '@/utils/functions';
import { FormInst } from 'naive-ui';
const appStore =  useAppStore()
const span = appStore.getSpan()
const props = defineProps<{
  initialModel: API.CompanyAI;
  objStore: Object,
}>();
onMounted(() => {
  emit('formMounted', formRef.value);
});
const emit = defineEmits(['handleValidateButtonClick', 'formMounted']);
const model = toRef(props, 'initialModel');
const formRef = ref<FormInst | null>(null);
const requiredFields: (keyof API.CompanyAI)[] = ['name', 'apiUrl', 'apiKey'];
const rules = generateValidationRules(props.initialModel, requiredFields);
const handleUploadSuccess = (fileName: string) => {
  model.value.logoUrl = fileName;
};
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
          path="logoUrl"
          :label="t('common.logoUrl')"
        >
          <SelectCountry
          />
        </NFormItemGi>
        
        <NFormItemGi
          :span="span"
          path="logoUrl"
          :label="t('common.logoUrl')"
        >
          <BaseUpload
            bucket="company"
            @upload-success="handleUploadSuccess"
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
          path="companyUrl"
          :label="t('common.companyUrl')"
        >
          <BaseInput
            v-model="model.companyUrl"
            :placeholder="t('common.companyUrl')"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="apiUrl"
          :label="t('common.apiUrl')"
        >
          <BaseInput
            v-model:value="model.apiUrl"
            :placeholder="t('common.apiUrl')"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
          />

        </NFormItemGi>
        <NFormItemGi
          :span="span"
          path="apiKey"
          :label="t('common.apiKey')"
        >
          <BaseInput
            v-model:value="model.apiKey"
            :placeholder="t('common.apiKey')"
            @keyup.enter="$emit('handleValidateButtonClick', $event)"
          />

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
