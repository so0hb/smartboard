<script lang="ts" setup>
import {  computed } from 'vue'
import { NAvatar } from 'naive-ui'
import defaultLogo from '@/assets/logo.png'
interface Props {
  size?: string | number
}

const props = defineProps<Props>()
  
const finalSize = computed(() => props.size ?? 'small')
</script>

<template>
  <span class="text-lg dark:text-white">
    <NAvatar  :size="finalSize" round :src="defaultLogo" />
  </span>
</template>
