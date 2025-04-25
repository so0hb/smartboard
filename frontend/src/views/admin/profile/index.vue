<script setup lang='ts'>
import {Profile} from '@/components/common'

import signOut from '@/views/auth/signOut.vue'
  
import { ref, h, VNodeChild, computed } from 'vue';
import { NForm, NInput, NButton, FormInst,
   UploadCustomRequestOptions, SelectOption,
   NAutoComplete, 
   FormRules,
   FormItemInst,
   FormValidationError} from 'naive-ui';
import { t } from '@/locales';
import { useMessage, NSelect, NGrid, NFormItemGi, NUpload, NSwitch } from 'naive-ui';
import { useAuthStore, useUsersStore, useUserStore, useUtilStore} from '@/store'
import { supabase } from '@/utils/supabase';
import { SvgIcon } from '@/components/common';
import { isEmailValid } from '@/utils/functions';
import { useBasicLayout } from '@/hooks/useBasicLayout';


const utilStore = useUtilStore()
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const userStore = useUserStore()
const userInfo = computed(() => userStore.$state.user!!)
const model = ref<API.CurrentUser>(userInfo.value);
const { isMobile } = useBasicLayout()
const span = computed(() => {
  return isMobile ? 24 : 12
})
const passwordFormItemRef = ref<FormItemInst | null>(null)
const rules: FormRules =  {
  firstName: [{ required: true, message: t('common.firstNameNameRequired'), trigger: ['input', 'blur'] }],
  lastName: [{ required: true, message: t('common.lastNameRequired'), trigger: ['input', 'blur'] }],
  email: [
        {
            required: true,
            message: t('auth.emailRequired'),
            trigger: ['input', 'blur']
        },
    ],
    password: [
        {
            required: true,
            message: t('auth.passwordRequired'),
            trigger: ['input', 'blur']
        }
    ]
};



function isButtonDisabled() {
  return (
    !model.value.firstName || 
    !model.value.lastName ||
    !model.value.email ||
    !model.value.password
    )
}
const renderLabel: (option: SelectOption) => VNodeChild = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(SvgIcon, {
        icon: 'flagpack:' + (typeof option.value === 'string' ? option.value.toLowerCase() : option.value),
        class: 'w-6 h-6',
      }),
      h(
        'span',
        {
          style: {
            marginLeft: '8px',
          },
        },
        option.label as string,
      ),
    ],
  );
};
const genderOptions = [
  { label: t('common.male'), value: 'Male' },
  { label: t('common.female'), value: 'Female' },
  { label: t('common.other'), value: 'Other' }
];


const options = computed(() => {
    return ['@gmail.com'].map((suffix) => {
        const prefix = ''//model.value.fristName!!.split('@')[0]
        return {
            label: prefix + suffix,
            value: prefix + suffix
        }
    })
})
function handlePasswordInput() {
    if (model.value.password) {
        passwordFormItemRef.value?.validate({ trigger: 'password-input' })
    }
}
const authStore = useAuthStore()
async function addUser() {
  try {
  
 
    // await authStore.signUp(
    //   model.value
    // );
    loading.value = false;
    // userStore.showAdd = false;
    message.success(t('commn.addSuccess'));
  } catch (error: any) {
    loading.value = false;
  
    console.error(t('common.addFailed'), error.message);
    message.error(t('common.addFailed'), error.message);
  
  }
}
function handleValidateButtonClick(e: MouseEvent) {

e.preventDefault();
formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {

        // Perform custom validation
        if (!isEmailValid(model.value.email!)) {
            message.error(t('auth.invalidEmailFormat'));
            loading.value = false;
            return;
        }

        else if (model.value.password && model.value.password.length < 8) {
            message.error(t('auth.passwordLengthError'));
            loading.value = false;
            return;
        }
        else {
            loading.value = true
            addUser();
        }

    } else {
        // console.log(errors);
        message.error(t('auth.fillAllField'));
        loading.value = false
    }
});
}
</script>

<template>
  <div class="border-none shadow-none flex flex-col gap-2 p-2 rounded-lg">

    <div class="post-heading mb-1">
      <div class="gtext text-2xl font-bold underlined">{{ t('common.myProfile') }}</div>
    </div>
   
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      size="large"
   
    >
      <div>
        <NGrid
    
        >
        
          <NFormItemGi
            :span="span"
            path="firstName"
            :label="t('common.firstName')"
          >
            <NInput
              v-model:value="model.firstName"
              :placeholder="t('common.firstName')"
              clearable
              @keydown.enter.prevent
            />
          </NFormItemGi>
          <NFormItemGi
            :span="span"
            path="lastName"
            :label="t('common.lastName')"
          >
            <NInput
              v-model:value="model.lastName"
              :placeholder="t('common.lastName')"
              clearable
              @keydown.enter.prevent
            />
          </NFormItemGi>
     

                <NFormItemGi
                 :span="span"
                    path="email"
                    :label="t('auth.email')"
                >
                    <NAutoComplete
                        v-model:value="model.email"
                        :input-props="{
                            autocomplete: 'disabled'
                        }"
                        :options="options"
                        size="large"
                        placeholder="Email"
                        clearable
                    >
                        <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
                            <NInput
                                placeholder="example@gmail.com"
                                @keydown.enter.prevent
                                :value="slotValue"
                                @input="handleInput"
                                @focus="handleFocus"
                                @blur="handleBlur"
                                size="large"
                            >
                                <template #prefix>
                                    <SvgIcon
                                        icon="ic:baseline-email"
                                        class="text-md text-primary"
                                    />
                                </template>
                            </NInput>
                        </template>
                    </NAutoComplete>
                </NFormItemGi>
               

          <!-- <NFormItemGi
            :span="span"
            path="state"
            :label="t('common.state')"
          >
            <NSwitch
              v-model:value="model.state as boolean"
              size="large"
            />
          </NFormItemGi> -->

        </NGrid>
      </div>
<div class="flex flex-col gap-2">
      <div style="display: flex; justify-content: flex-end">
        <NButton
          type="primary"
          style="width:100%;"
          size="large"
          :loading="loading"
          :disabled="isButtonDisabled()"
           @click="handleValidateButtonClick"
        >
          {{ t('common.update') }}
        </NButton>

      
      </div>
      <signOut/>
    </div>
    </NForm>
  </div>
</template>
  

  
