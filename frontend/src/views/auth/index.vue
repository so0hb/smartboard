<script setup lang='ts'>
import { LogoApp } from '@/components/common';
import { t } from '@/locales'
import { useRouter } from 'vue-router'
import { useLoadingBar } from 'naive-ui'
import PolicyCollection from './PolicyCollection.vue'
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
  <div class="grid grid-cols-1 md:grid-cols-2 h-full dark:text-white">

    <div class="bg-red-200 hidden   md:flex md:flex-col md:gap-4 md:justify-center md:items-center">
      <LogoApp :size="90" />
      <div class="font-bold p-4 gtext text-5xl">{{ t('common.nameApp') }}</div>
    </div>



    <div class="bg-blue-100 dark:bg-violet-950 flex items-center justify-center">
      <div class="grid grid-rows-3 h-full  place-content-between ">

        <div class="row-span-2 flex flex-col gap-12 h-full justify-end pb-8">

          <div class="font-bold gtext text-5xl text-center py-4">{{ t('app.getStart') }}</div>
          <div class="flex flex-wrap gap-4 justify-center">
            <NButton s class="btn btn-primary " @click="() => goTo('/auth/login')">
              {{ t('auth.login') }}
            </NButton>

            <!-- <button class="btn btn-primary w-48" @click="() => goTo('/auth/signup')">
              {{ t('auth.signUp') }}
            </button> -->

          </div>
        </div>
        <div class="place-self-center ">
    <!-- <PolicyCollection/> -->
    </div>

</div>
</div>



  </div>
</template>