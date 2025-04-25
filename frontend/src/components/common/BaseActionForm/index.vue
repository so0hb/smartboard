<script setup lang="ts">
import { ref, computed } from 'vue';
import { FormInst, useMessage } from 'naive-ui';
import { t } from '@/locales';
const props = defineProps<{
    initialModel: T;
    actionType: 'add' | 'update';
    objStore: Object,

    FormComponent: typeof import('vue');
  
}>();

const objStore = props.objStore;
const message = useMessage();

const loading = ref(false);
const model =  ref<T>({ ...props.initialModel });
const originalModel = ref<T>({ ...props.initialModel });

async function handleAddData() {
    try {
        loading.value = true;
        await objStore.insertDataAction(model.value);
        loading.value = false;
        objStore.showModelAdd = false;
        message.success(t('common.addSuccess'));
    } catch (error: any) {
        loading.value = false;
        console.error(t('common.addFailed'), error.message);
        message.error(t('common.addFailed'));
    }
}


async function handleUpdateData() {
    try {
        loading.value = true;
        await objStore.updateDataAction(model.value);
        loading.value = false;
        objStore.showModelUpdate = false;
        message.success(t('common.updateSuccess'));
    } catch (error: any) {
        loading.value = false;
        console.error(t('common.updateFailed'), error.message);
        message.error(t('common.updateFailed'), error.message);
    }
}




const isButtonDisabled = computed(() => {
    const isUpdate = props.actionType === 'update';
    return (
        loading.value ||
        (isUpdate && JSON.stringify(model.value) === JSON.stringify(originalModel.value))
    );
});


const formRefFromChild = ref<FormInst | null>(null);

function handleFormMounted(formRef: FormInst | null) {
  formRefFromChild.value = formRef;
}


function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault();
    formRefFromChild.value?.validate((errors: any) => {
      if (!errors) {
        if (props.actionType === 'add') {
          handleAddData();
        } else {
          handleUpdateData();
        }
      } else {
        message.error(t('auth.fillAllField'));
      }
    });
  
}


</script>

<template>
    <div class="border-none shadow-none flex flex-col gap-2 p-2 rounded-lg">

        <div class="gtext text-2xl font-bold underlined">
            {{ actionType === 'add' ? t('common.addNew') : t('common.update') }}
        </div>


        <component
            :initialModel="model"
            :objStore="objStore"
            :is="FormComponent"
             @handleValidateButtonClick="handleValidateButtonClick"
              @formMounted="handleFormMounted"
          
        />

    </div>


    <div style="display: flex; justify-content: flex-end">
        <NButton
            type="primary"
            style="width:100%;"
            size="large"
            :loading="loading"
            :disabled="isButtonDisabled"
            @click="handleValidateButtonClick"
        >
            {{ actionType === 'add' ? t('common.addNew') : t('common.update') }}
        </NButton>
    </div>

</template>
