<template>
    <NInputNumber
        :value="modelValue"
        @update:value="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        :step="step"
        :min="min"
        :max="max"
    />
</template>

<script setup lang="ts">
import { NInputNumber } from 'naive-ui';

// Define props with default values for step, min, and max
const props = defineProps<{
    modelValue?: number;   // Optional prop for the numeric value
    placeholder: string;
    step?: number;         // Optional step size
    min?: number;          // Optional minimum value
    max?: number;          // Optional maximum value
}>();

const emit = defineEmits(['update:modelValue']);
const step = props.step ?? 1;
const min = props.min ?? 0;
// const max = props.max;
</script>