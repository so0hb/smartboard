<script setup lang='ts'>
import { computed, ref } from 'vue'
// import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import { isString } from '@/utils/is'
import  LogoUser  from '../LogoUser/index.vue';
const userStore = useUserStore()

const userInfo = computed(() => userStore.$state)
const email = userInfo.value.user?.email ?? '';
const atIndex = email.indexOf('@');

const name = ref(atIndex !== -1 ? email.slice(0, atIndex) : email);
</script>

<template>
  <div class="flex items-center overflow-hidden">
<LogoUser/>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden  font-bold text-md text-ellipsis whitespace-nowrap">
        {{ name ?? 'User' }}
      </h2>
      <p class="overflow-hidden  text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isString(userInfo.description) && userInfo.description !== ''"
          v-html="userInfo.description"
        />
      </p>
    </div>
  </div>
</template>
