<script setup lang="ts">
import { computed, ref } from 'vue';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';
import { supabase } from '@/utils/supabase';
import { useAuthStore, useChatStore } from '@/store'
import signUpEmailPassword from './signUpEmailPassword.vue';
import { LogoApp } from '@/components/common';
import PolicyCollection from './PolicyCollection.vue'
const showSignUpEmailPassword = ref(false);
import OuthSocial from './OuthSocial.vue'
import {
  NButton,
  NAutoComplete,
  NFormItem,
  NInput,
  FormRules,
  useMessage,
  NDivider,
  NForm,
useLoadingBar,

} from 'naive-ui'
import { isEmailValid } from '@/utils/functions';
import { router } from '@/router';
const model = ref({

  email: '',

});
const loading = ref(false)
const authStore = useAuthStore()
const message = useMessage()
async function signInWithOAuth(provider: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  // Handle response/error as needed
}

function handleSignUpClick(provider: string) {
  if (provider === 'gmail') {
    showSignUpEmailPassword.value = true;
  } else {
    signInWithOAuth(provider);
  }
}

function addEmail() {
  loading.value = true;
  if (isEmailValid(model.value.email!)) {
    authStore.userAuth.email = model.value.email
    loading.value = false;
    showSignUpEmailPassword.value = true
  } else {
    message.error(t('auth.invalidEmailFormat'));
    loading.value = false;
    return;
  }

}

const options = computed(() => {
  return ['@gmail.com'].map((suffix) => {
    const prefix = model.value.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})



async function handleGoToLogin() {
  handleStart()
  // await router.push('/auth/otp')
  await router.push('/auth/login');
  handleFinish() 
 
}


const loadingBar = useLoadingBar()
const disabledRef = ref(true)
function handleStart() {
  loadingBar.start()
  disabledRef.value = false
}
function handleFinish() {
  loadingBar.finish()
  disabledRef.value = true
}

</script>

<template>
  <div class="grid grid-row-6  min-h-full py-4 dark:text-white">
    <div class="self-center row-span-2 place-self-center">
      <LogoApp :size="60" />
    </div>
    <template v-if="!showSignUpEmailPassword">
      <div
        class="row-span-4 bg-red-100 dark:bg-gray-800 dark:text-white relative place-self-center overflow-hidden flex flex-col gap-2 w-96  pb-12 px-2 glass rounded-lg"
      >
        <div class="h-20 w-20 absolute -left-5 -bottom-10 rounded-full bg-primary"></div>
        <div class="post-heading my-2">
          <div class="text1 text-2xl  gtext p-1  font-bold text-center">{{ t('auth.createAccount') }}</div>
        </div>
        <div>
          <NForm
            :model="model"
            size="large"
          >
            <NFormItem
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
                    @keyup.enter="addEmail"
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
            </NFormItem>
            <div class="w-full">
              <NButton
                @click="addEmail"
                style="width: 100%;"
                :loading="loading"
                :disabled="!model.email"
                type="primary"
              >{{ t('auth.signUp') }}</NButton>

            </div>
          </NForm>
        </div>

        <NDivider>
          {{ t('auth.or') }}
        </NDivider>
      

        <div class="flex flex-row-reverse justify-center gap-1 mb-4">
                 
                    <div class=" ">  {{ t('auth.goLogin') }}</div>
                    <div @click="handleGoToLogin" class="text-primary  text-blue-400 cursor-pointer underline">
                      {{ t('auth.loginIn') }}
                    </div>
        </div>
   
      </div>
    </template>

    <template v-else>
      <signUpEmailPassword />
    </template>

    <div class="row-span-2 place-self-center">
      <!-- <PolicyCollection /> -->
    </div>
  </div>
</template>
