<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/store'
import { useChatStore } from '@/store/modules/chat/index'
import PolicyCollection from './PolicyCollection.vue'
import { SvgIcon } from '@/components/common'
import { LogoApp } from '@/components/common';
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
    useLoadingBar,
    NAutoComplete,
    NDivider
} from 'naive-ui'
import { t } from '@/locales'
import { useRouter } from 'vue-router'
const router = useRouter()
const authStore = useAuthStore()
// const chatStore = useChatStore()
interface ModelType {
    username:string
    password: string
}
const formRef = ref<FormInst | null>(null)
const passwordFormItemRef = ref<FormItemInst | null>(null)
const message = useMessage()
const loading = ref(false)
const errorMessage = ref('')
const modelRef = ref<ModelType>({
  
    username: '',
    password: '',
})
const model = modelRef

const rules: FormRules = {
    // email: [
    //     {
    //         required: true,
    //         message: t('auth.emailRequired'),
    //         trigger: ['input', 'blur']
    //     },
    // ],
    username: [
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

function handlePasswordInput() {
    if (modelRef.value.password) {
        passwordFormItemRef.value?.validate({ trigger: 'password-input' })
    }
}

async function signIn() {
    try {
        errorMessage.value = '' // Clear any previous errors
        await authStore.Login(model.value.username!, model.value.password!);
        loading.value = false
        handleStart()
        await router.push({ name: 'dashboard' });
        handleFinish()

    } catch (error: any) {
        // console.error("error.message")
        errorMessage.value = "أسم المستخدم أو كلمة المرور غير متطابقة"
        // console.error(error.error)
        loading.value = false
        // error.value = t('auth.signInFailed')
    }
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
async function handleGoToSignUp() {
    handleStart()
    await router.push('/auth/signup');
    handleFinish()

}



function handleValidateButtonClick(e: MouseEvent) {

    e.preventDefault();
    formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
        if (!errors) {

            // Perform custom validation
            // if (!isEmailValid(model.value.email!)) {
            //     message.error(t('auth.invalidEmailFormat'));
            //     loading.value = false;
            //     return;
            // }

            // else 
            if (model.value.password && model.value.password.length < 8) {
                message.error(t('auth.passwordLengthError'));
                loading.value = false;
                return;
            }
            else {
                loading.value = true
                signIn();
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
    <div class="grid grid-row-6  min-h-full dark:text-white">
        <div class="self-center row-span-2 place-self-center">
            <LogoApp :size="60" />
        </div>

        <div
            class="flex flex-col relative overflow-hidden  place-self-center gap-6 w-96 pt-2 px-4 glass bg-red-100 dark:bg-gray-800 dark:text-white rounded-lg">
       
            <div class="post-heading">
                <div class="text1 text-3xl  font-bold text-center gtext p-1">{{ t('auth.loginIn') }}</div>
            </div>
           
            <div v-if="errorMessage" class="p-3 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/50 rounded-lg">
                {{ errorMessage }}
            </div>
            <NForm
                ref="formRef"
                :model="model"
                :rules="rules"
                size="large"
            >
            <NFormItem path="username" :label="t('auth.username')">
                <NInput v-model:value="model.username" placeholder="Username" >
                  <template #prefix>
                    <SvgIcon icon="ic:baseline-person" class="text-md text-primary" />
                  </template>
                </NInput>
              </NFormItem>

                <NFormItem
                    ref="passwordFormItemRef"
                    first
                    path="password"
                    :label="t('auth.password')"
                >
                    <NInput
                        v-model:value="model.password"
                        show-password-on="click"
                        @input="handlePasswordInput"
                        type="password"
                        :maxlength="50"
                        @keyup.enter="handleValidateButtonClick"
                    >

                        <template #prefix>
                            <SvgIcon
                                icon="mdi:password"
                                class="text-md text-primary"
                            />
                        </template>
                        <template #password-visible-icon>
                            <SvgIcon
                                icon="mdi:show"
                                class="text-md text-primary"
                            />
                        </template>
                        <template #password-invisible-icon>
                            <SvgIcon
                                icon="gridicons:not-visible"
                                class="text-md text-primary"
                            />
                        </template>

                    </NInput>

                </NFormItem>

                <div style="display: flex; justify-content: flex-end">
                    <NButton
                        type="primary"
                        style="width:100%;"
                        size="large"
                        :loading="loading"
                        :disabled="model.username === null || model.password === null"
                        @click="handleValidateButtonClick"
                    >
                        {{ t('auth.login') }}
                    </NButton>
                </div>
            </NForm>
            <div>
            <NDivider>
                {{ t('auth.or') }}
                </NDivider>
       
                <div class="flex flex-row-reverse justify-center gap-1 mb-12">
                 
                    <div> {{ t('auth.goSignUp') }}</div>
                    <div @click="handleGoToSignUp" class="text-primary   text-blue-400 cursor-pointer underlin">
                        {{ t('auth.createAccount') }}
                    </div>
                </div>
            </div> 

        </div>

        <div class="row-span-2 place-self-center">
            <!-- <PolicyCollection /> -->
        </div>

    </div>
</template>
