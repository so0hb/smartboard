<template>
  <NSelect
    :value="modelValue"
    @update:value="$emit('update:modelValue', $event)"
    :options="options"
    :placeholder="placeholder"
    clearable
    :multiple="multiple"
  />
</template>

<script setup lang="ts">
import { NSelect } from 'naive-ui';

const props = defineProps<{
  modelValue?: any;
  placeholder: string;
  options: Array<{ label: string; value: any }>;
  multiple?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);
</script>