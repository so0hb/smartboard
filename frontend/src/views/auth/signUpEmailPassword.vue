<script setup lang='ts'>
import { ref } from 'vue'
import { useAuthStore } from '@/store'
import { SvgIcon } from '@/components/common'
import { isEmailValid } from '@/utils/functions/index'

import {
  FormInst,
  FormItemInst,
  FormValidationError,
  useMessage,
  FormRules,
  NForm,
  NFormItem,
  NInput,
  NButton,
  FormItemRule,
  NDivider,
  useLoadingBar,
  NSpace,
  NAlert
} from 'naive-ui'
import { t } from '@/locales'
import { useRouter } from 'vue-router'
const router = useRouter()
const authStore = useAuthStore()
// const chatStore = useChatStore()

const formRef = ref<FormInst | null>(null)
const passwordFormItemRef = ref<FormItemInst | null>(null)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const loading = ref(false)
const showOTP = ref(true)
const modelRef = ref<User.UserAuth>(authStore.userAuth);
const model = modelRef
const step = ref<number>(1)
const messageError = ref<string>('')

// Step 1: First Name, Last Name, and Username
const step1Rules: FormRules = {
  firstName: [
    {
      required: true,
      message: t('auth.nameRequired'),
      trigger: ['input', 'blur']
    },
  ],
  lastName: [
    {
      required: true,
      message: t('auth.nameRequired'),
      trigger: ['input', 'blur']
    },
  ],
  username: [
    {
      required: true,
      message: t('auth.usernameRequired'),
      trigger: ['input', 'blur']
    },
  ],
};

// Step 2: Email
const step2Rules: FormRules = {
  email: [
    {
      required: true,
      message: t('auth.emailRequired'),
      trigger: ['input', 'blur']
    },
  ],
};

// Step 3: Password and Re-entered Password
const step3Rules: FormRules = {
  password: [
    {
      required: true,
      message: t('auth.passwordRequired'),
      trigger: ['input', 'blur']
    }
  ],
  reenteredPassword: [
    {
      required: true,
      message: 'Re-entered password is required',
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordStartWith,
      message: 'Password is not the same as re-entered password!',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: 'Password is not the same as re-entered password!',
      trigger: ['blur', 'password-input']
    }
  ]
};

function validatePasswordStartWith(
  rule: FormItemRule,
  value: string
): boolean {
  return (
    !!modelRef.value.password &&
    modelRef.value.password.startsWith(value) &&
    modelRef.value.password.length >= value.length
  )
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === modelRef.value.password
}

function handlePasswordInput() {
  if (modelRef.value.password) {
    passwordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}
function handleRePasswordInput() {

  if (modelRef.value.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}


async function goTo() {
  handleStart()
  await router.push('/auth/otp')
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


async function signUp() {
  try {
    // await authStore.signUp(
    //   model.value.firstName!,
    //   model.value.lastName!,
    //   model.value.email!,
    //   model.value.password!
    // );
    loading.value = true;
      await authStore.signUp(model.value);
    loading.value = false;
    await router.push('/admin');
    // showOTP.value = true;
  } catch (error: any) {
    loading.value = false;
    console.log("error", error)
    messageError.value = error.message
    message.error(t('auth.signInFailed') + " " + error.message);
  }
}

async function handleGoToLogin() {
  handleStart()
  // await router.push('/auth/otp')
  await router.push('/auth/login');
  handleFinish()

}

const rulesToValidate = ref<FormRules>(step1Rules);
function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault();
    // Determine which set of rules to validate based on the current step
    if (step.value === 1) {
    rulesToValidate.value = step1Rules;
  } else if (step.value === 2) {
    rulesToValidate.value = step2Rules;
  } else {
    rulesToValidate.value = step3Rules;
  }

  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      if (step.value === 2 && !isEmailValid(model.value.email!)) {
        message.error(t('auth.invalidEmailFormat'));
        loading.value = false;
        return;
      } else if (step.value === 3 && model.value.password && model.value.password.length < 8) {
        message.error(t('auth.passwordLengthError'));
        loading.value = false;
        return;
      } else {
        loading.value = true;
        signUp();
      }
    } else {
      message.error(t('auth.fillAllField'));
      loading.value = false;
    }
  });
}

async function nextStep() {
  if (step.value === 1 && model.value.email) {
    step.value += 2;
  } else {
    step.value += 1;
  }

  if (step.value === 1) {
    rulesToValidate.value = step1Rules;
  } else if (step.value === 2) {
    rulesToValidate.value = step2Rules;
  } else {
    rulesToValidate.value = step3Rules;
  }
}

function prevStep() {
  if (step.value > 1) {
    if (step.value === 3 && model.value.email) {
      step.value -= 2;
    } else {
      step.value -= 1;
    }
  }
  if (step.value === 1) {
    rulesToValidate.value = step1Rules;
  } else if (step.value === 2) {
    rulesToValidate.value = step2Rules;
  } else {
    rulesToValidate.value = step3Rules;
  }
}

function validStep1(): boolean {
  return model.value.firstName === '' || model.value.lastName === '' || model.value.username === '';
}

function validStep2(): boolean {
  return model.value.email === null;
}

function validStep3(): boolean {
  return model.value.password === '' || model.value.reenteredPassword === '' || model.value.password !== model.value.reenteredPassword;
}
</script>

<template>
  <div class="h-full flex justify-center items-center px-6 dark:text-white ">
    <div class="flex justify-center">
      <div class="flex flex-col gap-2 w-80  md:w-96">
        <div
          class="bg-blue-50 dark:bg-gray-800 dark:text-white relative py-4 px-2 place-self-center overflow-hidden flex flex-col gap-2 w-80  glass rounded-lg"
        >
          <div v-if="messageError !== ''" class="message pb-3">
            <NSpace vertical :size="12">
              <NAlert title="Error" type="error" :bordered="false">
                {{ messageError }}
              </NAlert>
            </NSpace>
          </div>

          <NForm ref="formRef" :model="model" :rules="rulesToValidate" size="large">
            <div :class="step !== 1 ? 'hidden' : ''">
              <!-- Step 1: First Name, Last Name, and Username Inputs -->
              <NFormItem path="firstName" :label="t('auth.firstName')">
                <NInput v-model:value="model.firstName" placeholder="First Name" @keydown.enter.prevent>
                  <template #prefix>
                    <SvgIcon icon="wpf:name" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem path="lastName" :label="t('auth.lastName')">
                <NInput v-model:value="model.lastName" placeholder="Last Name" @keyup.enter="nextStep">
                  <template #prefix>
                    <SvgIcon icon="wpf:name" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem path="username" :label="t('auth.username')">
                <NInput v-model:value="model.username" placeholder="Username" @keyup.enter="nextStep">
                  <template #prefix>
                    <SvgIcon icon="ic:baseline-person" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>

              <!-- Button for Step 1 -->
              <div class="flex justify-end mt-4">
                <NButton @click="nextStep" size="medium" style="width:100%" type="primary" :disabled="validStep1()">
                  {{ t('auth.next') }}
                </NButton>
              </div>
            </div>

            <div :class="step !== 2 ? 'hidden' : ''">
              <!-- Step 2: Email Input -->
              <NFormItem path="email" :label="t('auth.email')">
                <NInput v-model:value="model.email" placeholder="example@gmail.com" @keydown.enter.prevent>
                  <template #prefix>
                    <SvgIcon icon="ic:baseline-email" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>

              <!-- Buttons for Step 2 -->
              <div class="flex justify-between mt-4">
                <NButton @click="prevStep">{{ t('auth.previous') }}</NButton>
                <NButton type="primary" @click="nextStep" :disabled="validStep2()">
                  {{ t('auth.next') }}
                </NButton>
              </div>
            </div>

            <div :class="step !== 3 ? 'hidden' : ''">
              <!-- Step 3: Password and Re-entered Password Inputs -->
              <NFormItem ref="passwordFormItemRef" first path="password" :label="t('auth.password')">
                <NInput
                  v-model:value="model.password"
                  show-password-on="click"
                  @input="handleRePasswordInput"
                  type="password"
                  :maxlength="50"
                  @keydown.enter.prevent
                >
                  <template #prefix>
                    <SvgIcon icon="mdi:password" class="text-md text-primary" />
                  </template>
                  <template #password-visible-icon>
                    <SvgIcon icon="mdi:show" class="text-md text-primary" />
                  </template>
                  <template #password-invisible-icon>
                    <SvgIcon icon="gridicons:not-visible" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem ref="rPasswordFormItemRef" first path="reenteredPassword" :label="t('auth.ReenterPassword')">
                <NInput
                  v-model:value="model.reenteredPassword"
                  :disabled="!model.password"
                  show-password-on="click"
                  type="password"
                  :maxlength="50"
                  @keydown.enter.prevent
                >
                  <template #prefix>
                    <SvgIcon icon="mdi:password" class="text-md text-primary" />
                  </template>
                  <template #password-visible-icon>
                    <SvgIcon icon="mdi:show" class="text-md text-primary" />
                  </template>
                  <template #password-invisible-icon>
                    <SvgIcon icon="gridicons:not-visible" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>

              <!-- Buttons for Step 3 -->
              <div class="flex justify-between mt-4">
                <NButton @click="prevStep">{{ t('auth.previous') }}</NButton>
                <NButton
                  type="primary"
                  :loading="loading"
                  @click="handleValidateButtonClick"
                  :disabled="validStep3()"
                >
                  {{ t('auth.signUp') }}
                </NButton>
              </div>
            </div>
          </NForm>
          <NDivider />

          <!-- <div class="flex flex-col justify-center items-center gap-2 text-primary cursor-pointer">
            <div @click="handleGoToLogin">{{ t('auth.goLogin') }}</div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>