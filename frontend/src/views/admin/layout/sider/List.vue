<script setup lang="ts">
import { ref, computed } from 'vue'
import { NMenu, NScrollbar, useLoadingBar } from 'naive-ui'
import type { MenuInst, MenuOption } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useIconRender } from '@/hooks/useIconRender';
import { t } from '@/locales';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useAppStore } from '@/store';
import { useAuthStore } from '@/store/modules/auth'
const router = useRouter()
const accordionRef = ref(false)
const selectedKeyRef = ref('dashboard')
const menuInstRef = ref<MenuInst | null>(null)
const { iconRender } = useIconRender()
const loadingBar = useLoadingBar()
const { isMobile } = useBasicLayout()
const appStore = useAppStore()
const disabledRef = ref(true)
const authStore = useAuthStore()


const userStore = useUserStore()


const userInfo = computed(() => userStore.$state.user!!)
function handleStart() {
  loadingBar.start()
  disabledRef.value = false
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}
function handleFinish() {
  loadingBar.finish()
  disabledRef.value = true
}


async function handleUpdateValue(key: string, item: MenuOption) {
  handleStart()


  switch (key) {
    case 'dashboard':
      await router.push({ name: 'dashboard' });
      handleFinish()
      break
    case 'students':
      await router.push({ name: 'users', params: { userType: 'student' } });
      handleFinish()
      break
      case 'instructors':
      await router.push({ name: 'users', params: { userType: 'instructor' } });
      handleFinish()
      break
    case 'admins':
      await router.push({ name: 'users', params: { userType: 'admin' } });
      handleFinish()
      break
    case 'companyai':
      await router.push({ name: 'companyai' });
      handleFinish()
      break
    case 'modelsai':
      await router.push({ name: 'modelsai' });
      handleFinish()
      break
    case 'chat':
      await router.push({ name: 'main-chat' });
      handleFinish()
      break
    case 'profile':
      await router.push({ name: 'profile' });
      handleFinish()
      break
    case 'settingsapp':
      await router.push({ name: 'settingsapp' });
      handleFinish()
      break
      case 'edit-terms-of-use':
        await router.push({ name: 'edit-terms-of-use' });
        break;
      case 'edit-privacy-policy':
        await router.push({ name: 'edit-privacy-policy' });
        break;
    case 'major':
      await router.push({ name: 'major' });
      handleFinish()
      break
      case 'translation':
      await router.push({ name: 'translation' });
      handleFinish()
      break
      case 'filesmanager':
      await router.push({ name: 'filesmanager' });
      handleFinish()
      break 
      case 'themes':
      await router.push({ name: 'themes' });
      handleFinish()
      break 

      case 'settings':
      await router.push({ name: 'settings' });
      handleFinish()
      break 

      case 'country':
      await router.push({ name: 'country' });
      handleFinish()
      break 
      
      case 'submit-question':
        await router.push({ name: 'submit-question' });
        handleFinish()
        break
      case 'list-questions':
        await router.push({ name: 'list-questions' });
        handleFinish()
        break
    case 'ai-settings':
      await router.push({ name: 'ai-settings' });
      handleFinish()
      break
  }

}
const accordion = accordionRef
const selectedKey = selectedKeyRef
const menuOptions = computed(() => {
  const baseOptions: MenuOption[] = [
    {
      type: 'group',
      label: t('common.dashboard'),
      key: 'Dashboard',
      children: [
        {
          label: t('common.dashboard'),
          key: 'dashboard',
          icon: iconRender({ icon: 'material-symbols:dashboard' }),
        },
      ]
    }
  ]

  if (userInfo.value.role === 'admin') {
    baseOptions.push({
      type: 'group',
      label: t('common.userManagement'),
      key: 'user-management',
      children: [
        {
          label: t('common.students'),
          key: 'students',
          disabled: false,
          icon: iconRender({ icon: 'mdi:users' }),
        },
        {
          label: t('common.instructors'),
          key: 'instructors',
          icon: iconRender({ icon: 'mdi:account-student' }),
        },
        {
          label: t('common.admins'),
          key: 'admins',
          icon: iconRender({ icon: 'eos-icons:admin' }),
        }
      ]
    })
  }

  baseOptions.push(
    {
      type: 'group',
      label: t('common.Questions'),
      key: 'questions-management',
      children: [
        {
          label: t('common.submitNewQuestion'),
          key: 'submit-question',
          icon: iconRender({ icon: 'mdi:plus-circle' }),
        },
        {
          label: t('common.listQuestions'),
          key: 'list-questions',
          icon: iconRender({ icon: 'mdi:format-list-bulleted' }),
        }
      ]
    },
    {
      type: 'group',
      label: t('common.settings'),
      key: 'settings',
      children: [
        {
          label: t('common.profile'),
          key: 'profile',
          icon: iconRender({ icon: 'gg:profile' }),
        }
      ],
    }
  )

  if (userInfo.value.role === 'admin') {
    baseOptions.push({
      label: t('settings.aiSettings'),
      key: 'ai-settings',
      icon: iconRender({ icon: 'i-mdi-robot' }),
      path: '/admin/ai-settings'
    })
  }

  return baseOptions
})


const inverted = ref(false)
</script>

<template>
  <NScrollbar class="">
    <NMenu
      :inverted="inverted"
      ref="menuInstRef"
      :accordion="accordion"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      @update:value="handleUpdateValue"
    />
  </NScrollbar>
</template>
