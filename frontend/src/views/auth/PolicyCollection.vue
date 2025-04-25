<script setup lang='ts'>
import { t } from '@/locales'
import { useRouter } from 'vue-router'
import { useLoadingBar,  NDivider } from 'naive-ui'
import { ref } from 'vue';
const router = useRouter()
async function goTo(route: string) {
  handleStart()
  await router.push(route)
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
          <button class="underline" @click="() => goTo('/policies/terms-of-use')">
            {{ t('app.termsOfUse') }}
          </button>
          <NDivider 
          style="color: #000;"
           vertical />
          <button class="underline" @click="() => goTo('/policies/privacy-policy')">
            {{ t('app.privacyPolicy') }}
          </button>
        
</template>