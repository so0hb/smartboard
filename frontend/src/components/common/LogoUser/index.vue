<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useUserStore } from '@/store'
const userStore = useUserStore()

const userInfo = computed(() => userStore.$state)
const email = userInfo.value.user?.email ?? '';
const atIndex = email.indexOf('@');
const name = ref(atIndex !== -1 ? email.slice(0, atIndex) : email);
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="avatar placeholder">
  <div class="bg-neutral text-neutral-content rounded-full w-8">
    <span class="text-2xl"> {{ name.charAt(0).toUpperCase() }}</span>
  </div>
</div> 
  </div>
</template>
