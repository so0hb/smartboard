<template>
  <NInput
    :value="modelValue"
    @update:value="$emit('update:modelValue', $event)"
    @keyup.enter="$emit('enter')"
    :placeholder="placeholder"
    :type="type"  
    v-bind="{ autosize }"  
    clearable
    @keydown.enter.prevent
  />
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui';
const props = defineProps<{
  modelValue?: string;
  placeholder: string;
  type?: 'textarea' | 'text' | 'password'; 
  autosize?: object; 
}>();
const type = props.type ?? 'text';
const autosize = type === 'textarea'
  ? props.autosize ?? { minRows: 2, maxRows: 4 }
  : undefined;
const emit = defineEmits(['update:modelValue', 'enter']);
</script>
