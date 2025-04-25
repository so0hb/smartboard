<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from '../../../../components/common/Sider/Footer.vue'
import { useAppStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore, LogoApp } from '@/components/common'
import { t } from '@/locales';
const appStore = useAppStore()
const { isMobile } = useBasicLayout()
const show = ref(false)
const collapsed = computed(() => appStore.siderCollapsed)


function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)


</script>

<template>
  <NLayoutSider :collapsed="appStore.siderCollapsed" :collapsed-width="0" :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'" collapse-mode="transform" position="absolute" bordered
    :style="getMobileClass" @update-collapsed="handleUpdateCollapsed">
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">


        <div class="flex flex-col px-4 py-3 bg-slate-100   justify-center items-center ">

          <div class="flex flex-row py-2  justify-center  items-center gap-2 w-full">
            <!-- <LogoApp :size="35" /> -->
            <div class="gtext font-bold text-base"> {{ t('common.nameApp') }}</div>
            <!-- <SvgIcon icon="ri:chat-new-fill" /> -->
          </div>

        </div>

        <div class="flex-1 min-h-0 pb-4  overflow-hidden">
          <List />
        </div>


      </main>
      <div class="">
        <Footer />
      </div>
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <!-- <PromptStore v-model:visible="show" /> -->
</template>
