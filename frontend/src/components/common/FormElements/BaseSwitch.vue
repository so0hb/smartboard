
<!-- BaseSwitch.vue -->
<template>
  <NSwitch
    :value="modelValue"
    @update:value="$emit('update:modelValue', $event)"
    size="large"
  />
</template>

<script setup lang="ts">
import { NSwitch } from 'naive-ui';

const props = defineProps<{
  modelValue?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);
</script>