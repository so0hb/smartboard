<script setup lang="ts">
import { ref, h, VNodeChild, computed } from 'vue';
import { NForm, NInput, NButton, FormInst,
   UploadCustomRequestOptions, SelectOption,
   NAutoComplete, 
   FormRules,
   FormItemInst,
   FormValidationError,
   UploadFileInfo} from 'naive-ui';
import { t } from '@/locales';
import { useMessage, NSelect, NGrid, NFormItemGi, NUpload, NSwitch } from 'naive-ui';
import countryList, { Country } from 'country-list';
import { useUsersStore, useUtilStore } from '@/store'
import { supabase, supabaseUrlImage } from '@/utils/supabase';
import { SvgIcon } from '@/components/common';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { isEmailValid } from '@/utils/functions';


const objStore = useUsersStore()
const { isMobile } = useBasicLayout()
const span = computed(() => {
  return isMobile ? 24 : 12
})
interface Props {
    item: User.UserData
}
const props = defineProps<Props>()
const message = useMessage();
const allCountries: Country[] = countryList.getData();
const countriesOptions = allCountries.map(country => ({
    label: country.name,
    value: country.code,
    disabled: false,
}));
const utilStore = useUtilStore()
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const initialModelRef = ref<User.UserData>({ ...props.item });
const model = ref<User.UserData>({ ...props.item });


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
// async function handleUpdateUniversity() {
//     try {
//         loading.value = true;
//         await objStore.updateDataAction({id:props.item.id!, updates:model.value});
//         loading.value = false;
//         objStore.showModelUpdate = false;
//         message.success(t('commn.updateSuccess'));
//     } catch (error: any) {
      
//         console.error(t('common.updateFailed'), error.message);
//         message.error(t('common.updateFailed'));
//     }
// }
const customRequest = async ({ file, data: dataParams, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
    try {
      if (!dataParams) {
        throw new Error('dataParams is undefined');
      }

      const progressEvent = { loaded: 20, total: 100 };
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress({ percent: percentCompleted });

      const { data, error } = await supabase.storage.from(dataParams.bucket).upload(`${file.name}`, file.file!, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        if (error.statusCode === "409" && error.error === "Duplicate") {
          model.value.avatarUrl = file.name;
          onFinish()
        } else {
          throw error;
        }
      }

      if (data) {
        model.value.avatarUrl = data.path;
        onFinish();
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
      onError();
    }
  };
  const previewFileList = ref<UploadFileInfo[]>([
  {
    id: '',
    name: model.value.avatarUrl ?? '',
    status: 'finished',
    url: model.value.avatarUrl
  },
]);

const isButtonDisabledComputed = computed(() => {
  return loading.value || !model.value.firstName || !model.value.lastName || JSON.stringify(model.value) === JSON.stringify(initialModelRef.value);
});

async function handleUpdateData() {
  try {
    loading.value = true;
    if (model.value.avatarUrl === initialModelRef.value.avatarUrl) {
      delete model.value.avatarUrl;
    }
    await objStore.updateDataAction(model.value);
    loading.value = false;
    objStore.showUpdate = false;
    message.success(t('common.updateSuccess'));
  } catch (error: any) {
    loading.value = false;
    console.error(t('common.updateFailed'), error.message);
    message.error(t('common.updateFailed'), error.message);
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

        // else if (model.value.password && model.value.password.length < 8) {
        //     message.error(t('auth.passwordLengthError'));
        //     loading.value = false;
        //     return;
        // }
        else {
            loading.value = true
            handleUpdateData();
        }

    } else {
        console.log(errors);
        message.error(t('auth.fillAllField'));
        loading.value = false
    }
});
}

const options = computed(() => {
    return ['@gmail.com'].map((suffix) => {
        const prefix = model.value.email!.split('@')[0]
        return {
            label: prefix + suffix,
            value: prefix + suffix
        }
    })
})
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

</script>

<template>
         <div class="border-none shadow-none flex flex-col gap-2 p-2 rounded-lg">
            <div class="post-heading mb-1">
                <div class="gtext text-2xl font-bold underlined">{{ t('common.update') }}</div>
            </div>
            <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      size="large"
   
    >
      <div>
        <NGrid
      
        :span="span" 
        :x-gap="24"
        >
          <!-- <NFormItemGi
            :span="span"
             path="avatarUrl"
            :label="t('common.logoUrl')"
          >
            <NUpload
            accept="image/*"
              list-type="image-card"
              :max="1"
              path="avatarUrl"
              :data="{ 'bucket': 'profiles' }"
             :default-file-list="model.avatarUrl ? previewFileList : []"
              :custom-request="customRequest"
            >
            </NUpload>
          </NFormItemGi> -->
          <NFormItemGi
            :span="span"
            path="firstName"
            :label="t('common.firstName')"
          >
            <NInput
              v-model:value="model.firstName"
              :placeholder="t('common.firstName')"
              clearable
               @keyup.enter="handleValidateButtonClick($event, handleUpdateData)"
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
               @keyup.enter="handleValidateButtonClick($event, handleUpdateData)"
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
                                 @keyup.enter="handleValidateButtonClick($event, handleUpdateData)"
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
                        :maxlength="20"
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

                </NFormItemGi> -->
          <!-- <NFormItemGi
            :span="span"
            path="gender"
            :label="t('common.gender')"
          >
            <NSelect
              filterable
              trigger="hover"
              v-model:value="model.gender"
              :options="genderOptions"
               @keyup.enter="handleValidateButtonClick($event, handleUpdateData)"
             
            >
              <NButton>{{ t('common.gender') }}</NButton>
            </NSelect>
          </NFormItemGi>
          <NFormItemGi
            :span="span"
            path="country"
            :label="t('common.country')"
          >
            <NSelect
              filterable
              trigger="hover"
              v-model:value="model.country"
              :options="utilStore.getCountryOption()"
              :render-label="renderLabel"
            >
              <NButton>{{ t('common.country') }}</NButton>
            </NSelect>
          </NFormItemGi> -->

          <!-- <NFormItemGi
            :span="span"
            path="state"
            :label="t('common.state')"
             @keyup.enter="handleValidateButtonClick($event, handleUpdateData)"
          >
            <NSwitch
              v-model:value="model.state as boolean"
              size="large"
            />
          </NFormItemGi> -->

        </NGrid>
      </div>

      <div style="display: flex; justify-content: flex-end">
       <NButton
          type="primary"
          style="width:100%;"
          size="large"
          :loading="loading"
          :disabled="isButtonDisabledComputed"
          @click="handleValidateButtonClick($event, handleUpdateData)"
        >
          {{ t('common.update') }}
        </NButton>
      </div>

    </NForm>
        </div>
</template>
  
