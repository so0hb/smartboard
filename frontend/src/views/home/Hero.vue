<script lang="ts" setup>
import { t } from '@/locales'
import { useRouter } from 'vue-router'
import { useLoadingBar } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { ref, onMounted, onBeforeUnmount} from 'vue';

const router = useRouter()
async function goService() {
  handleStart()
  await router.push('auth')
  handleFinish()
}

const { isMobile } = useBasicLayout()
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
  <div
    class="bg-blue-100 dark:bg-gray-950 dark:text-white flex py-24 px-8  w-full  overflow-hidden h-[550px]   rounded-lg  gap-22"
  >
  
  <section class="py-20 text-center">
          <h2 class="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
            Revolutionize Discussion Boards with AI
          </h2>
          <p class="text-xl mb-8">
            SmartBoard AI enhances traditional discussion boards by integrating Generative AI to boost engagement, streamline content management, and reduce redundancy. Empower instructors and students with a dynamic, interactive learning experience.
          </p>
            <n-button type="primary" size="large" @click="goService">   {{ t('app.start') }}</n-button>
        </section>


  </div>
</template>
