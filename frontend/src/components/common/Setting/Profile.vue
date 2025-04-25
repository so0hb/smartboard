<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { NForm, NInput, NButton, NSelect, NSwitch, NFormItemGi, useMessage, FormInst, FormRules, NGrid } from 'naive-ui'
import { useUserStore } from '@/store'

import { t } from '@/locales'
import signOut from '@/views/auth/signOut.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { getImageUrl } from '@/utils/supabaseHelper';

const { isMobile } = useBasicLayout();
const span = computed(() => (isMobile ? 24 : 12));

const userStore = useUserStore()
const ms = useMessage()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const userInfo = computed(() => userStore.$state)

const avatar = ref(userInfo.value.userMetaData.avatar ?? '')
const email = userInfo.value.user?.email ?? ''
const atIndex = email.indexOf('@')
const name = ref(atIndex !== -1 ? email.slice(0, atIndex) : email)
const description = ref(userInfo.value.userMetaData.description ?? '')
const firstName = ref(userInfo.value.userMetaData.fristName ?? '')
const lastName = ref(userInfo.value.userMetaData.lastName ?? '')
const avatarUrl = ref(userInfo.value.userMetaData.avatarUrl ?? '')
const dateOfBirth = ref(userInfo.value.userMetaData.dateOfBirth ?? '')
const state = ref(userInfo.value.userMetaData.state ?? false)
const gender = ref(userInfo.value.userMetaData.gender ?? 'Male') // Default to 'Male'
const userType = ref(userInfo.value.userMetaData.userType ?? 'Client') // Default to 'Client'
const country = ref(userInfo.value.userMetaData.country ?? '')

const rules: FormRules = {
  firstName: [{ required: true, message: t('common.firstNameRequired'), trigger: ['input', 'blur'] }],
  // lastName: [{ required: true, message: t('common.lastNameRequired'), trigger: ['input', 'blur'] }],
  // avatarUrl: [{ required: true, message: t('common.avatarUrlRequired'), trigger: ['input', 'blur'] }],
  // dateOfBirth: [{ required: true, message: t('common.dateOfBirthRequired'), trigger: ['input', 'blur'] }],
  // description: [{ required: true, message: t('common.descriptionRequired'), trigger: ['input', 'blur'] }],
  // state: [{ required: true, message: t('common.stateRequired'), trigger: ['input', 'blur'] }],
  // gender: [{ required: true, message: t('common.genderRequired'), trigger: ['input', 'blur'] }],
  // userType: [{ required: true, message: t('common.userTypeRequired'), trigger: ['input', 'blur'] }],
  // country: [{ required: true, message: t('common.countryRequired'), trigger: ['input', 'blur'] }],
}

function updateUserInfo() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      const updatedInfo: Partial<API.UserMetaData> = {
        fristName: firstName.value,
        lastName: lastName.value,
        avatar: avatar.value,
        avatarUrl: avatarUrl.value,
        dateOfBirth: dateOfBirth.value,
        description: description.value,
        state: state.value,
        gender: gender.value,
        userType: userType.value,
        country: country.value,
      }
      loading.value = true
      userStore.updateUserState(updatedInfo)


    } else {
      ms.error(t('auth.fillAllField'))
    }
  })
}

function handleReset() {
  userStore.resetUserState()
  ms.success(t('common.success'))
  window.location.reload()
}
</script>

<template>

<div class="container_dashboard">

        <div class="p-8 m-8 shadow-lg mx-20 border-none  flex flex-col gap-2  rounded-lg">
            <div class="post-heading mb-1">
      <div class="gtext text-2xl font-bold underlined mb-8">   {{ t('setting.profile')  }}</div>
    </div>

    <NForm
      ref="formRef"
      size="large"
      :model="{}"
      :rules="rules"
      class="space-y-4"
    >
      <NGrid
        :span="span"
        :x-gap="24"
      >
        <NFormItemGi
          path="firstName"
          :span="span"
          :label="t('setting.firstName')"
        >
          <NInput
            v-model:value="firstName"
            placeholder="Enter first name"
          />
        </NFormItemGi>

        <NFormItemGi
          path="lastName"
            :span="span"
          :label="t('setting.lastName')"
        >
          <NInput
            v-model:value="lastName"
            placeholder="Enter last name"
          />
        </NFormItemGi>

        <!-- <NFormItemGi
          path="avatarUrl"
            :span="span"
          :label="t('setting.avatarUrl')"
        >
          <NInput
            v-model:value="avatarUrl"
            placeholder="Enter avatar URL"
          />
        </NFormItemGi> -->

        <NFormItemGi
          path="dateOfBirth"
            :span="span"
          :label="t('setting.dateOfBirth')"
        >
          <NInput
            v-model:value="dateOfBirth"
            placeholder="Enter date of birth"
          />
        </NFormItemGi>

        <!-- <NFormItemGi
          path="state"
            :span="span"
          :label="t('setting.state')"
        >
          <NSwitch v-model:value="state" />
        </NFormItemGi> -->

        <NFormItemGi
          path="gender"
            :span="span"
          :label="t('setting.gender')"
        >
          <NSelect
            v-model:value="gender"
            :options="[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }]"
            placeholder="Select gender"
            clearable
          />
        </NFormItemGi>

        <!-- <NFormItemGi
          path="userType"
            :span="span"
          :label="t('setting.userType')"
        >
          <NSelect
            v-model:value="userType"
            :options="[{ label: 'Client', value: 'Client' }, { label: 'Agri-Expert', value: 'Agri-Expert' }, { label: 'Admin', value: 'Admin' }]"
            placeholder="Select user type"
            clearable
          />
        </NFormItemGi> -->

        <NFormItemGi
          path="country"
            :span="span"
          :label="t('setting.country')"
        >
          <NInput
            v-model:value="country"
            placeholder="Enter country"
          />
        </NFormItemGi>

        <!-- <NFormItemGi
          path="description"
            :span="span"
          :label="t('setting.description')"
        >
          <NInput
            v-model:value="description"
            type="textarea"
            placeholder="Enter description"
          />
        </NFormItemGi> -->
      </NGrid>
      <div class="flex items-center space-x-4">
        <NButton
          type="primary"

          :loading="loading"
          @click="updateUserInfo"
        >
          {{ t('common.save') }}
        </NButton>
        <!-- <NButton
          type="default"
          @click="handleReset"
        >
          {{ t('common.reset') }}
        </NButton> -->
        <signOut />
      </div>
    </NForm>
  </div>
</div>
</template>
