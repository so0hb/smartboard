<script setup lang="ts">
import { h, VNodeChild, ref,  } from 'vue';
import {  SelectOption } from 'naive-ui';
import { useUtilStore,    } from '@/store';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';
const utilStore = useUtilStore();

interface Props {
  filterable?: boolean;
  multiple?: boolean;
  maxTagCount?: number;
}

const props = defineProps<Props>();
const country_code = 'ye'
const multiple = ref(props.multiple || false);
const filterable = ref(props.filterable || false);
const maxTagCount = ref(props.maxTagCount || 2);

const renderLabel: (option: SelectOption) => VNodeChild = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(SvgIcon, {
        icon: 'flagpack:' + (typeof option.value === 'string' ? option.value.toLowerCase() : option.value),
        class: 'w-6 h-6',
      }),
      h(
        'span',
        {
          style: {
            marginLeft: '8px',
          },
        },
        option.label as string,
      ),
    ],
  );
};

// function handleSelectValueCountry(value: string, option: SelectOption) {
//     universityStore.current_university.country_code = value;
//   console.log('country_code.value', country_code.value);
// }
</script>

<template>
  <NSelect
    :multiple="multiple"
    :consistent-menu-width="false"
    :max-tag-count="maxTagCount"
    :filterable="filterable"
    trigger="hover"
    :options="utilStore.getCountryOption()"

    v-model:value="country_code"
    :render-label="renderLabel"
  >
    <NButton>{{ t('university.country') }}</NButton>
  </NSelect>
</template>
