<script setup lang='ts'>
import {

 DataTableColumns,
  NA,
  NText,
  NSwitch,
  NAvatar,
} from 'naive-ui'
import FormView from './FormView.vue'
const objStore = useCompanyStore()
const columns = reactive<DataTableColumns<API.CompanyAI>>([
  {
    title: t('common.name'),
    key: 'name',
    align: 'center',
    render(row: API.CompanyAI) {
      return h(NText, { strong: true }, { default: () => row.name });
    },
    sorter: 'default',
  
  },
  {
    title: t('common.companyUrl'),
    key: 'companyUrl',
    align: 'center',
    render(row: API.CompanyAI) {
      return row.companyUrl ? h(NA, { href: row.companyUrl, target: '_blank' }, { default: () => row.companyUrl }) : null;
    },
    ellipsis: true,
     
  },
  {
    title: t('common.logoUrl'),
    key: 'logoUrl',
    align: 'center',
    render(row: API.CompanyAI) {
      const hasLogoUrl = row.logoUrl !== null && row.logoUrl !== undefined && row.logoUrl.trim() !== '';

      const defaultIcon = h(SvgIcon, {
        icon: "mdi:company",
        class: "text-lg text-primary"
      });

      return hasLogoUrl
        ? h(NAvatar, {
          round: true,
          src: row.logoUrl,
          size: "large"
        })
        : defaultIcon;
    },
    ellipsis: true,
      
  },
  {
    title: t('common.apiUrl'),
    key: 'apiUrl',
    align: 'center',
    render(row: API.CompanyAI) {
      return h(NText, { type: 'info' }, { default: () => row.apiUrl });
    },
    ellipsis: true,
       
  },
  {
    title: t('common.apiKey'),
    key: 'apiKey',
    align: 'center',
    render(row: API.CompanyAI) {
      return h(NText, { type: 'info' }, { default: () => row.apiKey });
    },
    ellipsis: true,
      
  },
  {
    title: t('common.isActivate'),
    key: 'isActivate',
    align: 'center',
    render(row: API.CompanyAI) {
      return h(NSwitch, { value: row.isActivate, disabled: true });
    },
      
  },
  {
    title: t('common.createdAt'),
    key: 'createdAt',
    align: 'center',
    render(row: API.CompanyAI) {
      return h(NText, {}, { default: () => new Date(row.createdAt).toLocaleString() });
    },
    sorter: (a, b) => Number(a.createdAt) - Number(b.createdAt),

       
  },
  {
    title: t('common.updatedAt'),
    key: 'updatedAt',
    align: 'center',
    render(row: API.CompanyAI) {
      return h(NText, {}, { default: () => new Date(row.updatedAt).toLocaleString() });
    },
      
  }
]);

</script>
<template>

  <DataTableBase
    :title="t('common.company')"
    :objStore="objStore"
    :columns="columns"
    :FormView="FormView"
  />

</template>
