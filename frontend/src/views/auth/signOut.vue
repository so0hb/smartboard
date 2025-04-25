
<script setup lang='ts'>

import { useAuthStore } from '@/store'
import { useRouter } from 'vue-router'
import { ref } from 'vue';
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
import { t } from '@/locales'
import {
    useMessage,
    NButton,
} from 'naive-ui'
const message = useMessage()
async function signOut() {
    try {
        loading.value = true
        await authStore.signOut();
        await router.push({ name: 'login' });
    } catch (error) {
        loading.value = false
        message.error(t('auth.logOutFailed'));
    }finally {
        loading.value = false
  }
}

</script>

<template>
  <NButton  type="error" strong secondary round :loading="loading" @click="signOut">
   {{ t('auth.logOut') }}
  </NButton>
</template>











  
