<script setup lang='ts'>
import {  h,  reactive } from 'vue';
import {
    DataTableBaseColumn,
 DataTableColumns,
 NText, NSwitch,

} from 'naive-ui';
import { useModelStore } from '@/store';
import { t } from '@/locales';
import { DataTableBase} from '@/components/common';
import FormView from './FormView.vue';

import Card from './Card.vue'
const modelStore = useModelStore();
const cardColumn = reactive<DataTableBaseColumn<API.ModelAI>>({
  title: t('common.company'),
  key: 'company',
  render(row: API.ModelAI) {
    return h(
      Card,
      {
        companyId: row.companyId
      },
    )
  },
})
const mainColumns = reactive<DataTableBaseColumn<API.ModelAI>[]>([
  {
    title: t('common.name'),
    key: 'name',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NText, { strong: true }, { default: () => row.name });
    }
  },
  {
    title: t('common.modelCode'),
    key: 'modelCode',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NText, { type: 'info' }, { default: () => row.modelCode });
    },
    ellipsis: true
  },

  {
    title: t('common.description'),
    key: 'description',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NText, {}, { default: () => row.description || 'N/A' });
    },
    ellipsis: true
  },
  {
    title: t('common.version'),
    key: 'version',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NText, {}, { default: () => row.version || 'N/A' });
    },
    ellipsis: true
  },
  {
    title: t('common.isActivate'),
    key: 'isActivate',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NSwitch, { value: row.isActivate, disabled: true });
    }
  },
  {
    title: t('common.createdAt'),
    key: 'createdAt',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NText, {}, { default: () => new Date(row.createdAt).toLocaleString() });
    }
  },
  {
    title: t('common.updatedAt'),
    key: 'updatedAt',
    align: 'center',
    render(row: API.ModelAI) {
      return h(NText, {}, { default: () => new Date(row.updatedAt).toLocaleString() });
    }
  }
]);


const columns = reactive<DataTableColumns<API.ModelAI>>([
 
  cardColumn,
  ...mainColumns,
]);
</script>

<template>
  <DataTableBase
    :title="t('common.models')"
    :objStore="modelStore"
    :columns="columns"
    :FormView="FormView"
  />
</template>

<!-- 
<template>
  <div class="container_dashboard">
    <div class="header_dashboard">
      {{ t('common.models') }}
    </div>
    <div>
      <div class="flex gap-2 justify-end items-center my-2 mt-8">
        <NSpace vertical>
          <NSpace justify="space-between">
            <NButton
              @click="modelStore.showModelAdd = true"
              type="primary"
            >
              <div class="flex gap-2 items-center">
                <SvgIcon
                  icon="mdi:add-bold"
                  class=" text-base"
                />
                <div class="hidden md:block">{{ t('common.add') }}</div>
              </div>
            </NButton>

            <NButton
              strong
              secondary
              type="error"
              :disabled="checkedRowKeysRef.length > 0 ? false : true"
              @click="deleteSelectedRows"
            >
              <div class="flex gap-2 items-center">
                <SvgIcon
                  icon="fluent:delete-32-regular"
                  class=" text-base"
                />
                <div class="hidden md:block">{{ t('common.delete') }}</div>
              </div>
            </NButton>
          </NSpace>
          <NDataTable
            remote
           :min-height="isMobile ? 380 : 540"
            :max-height="isMobile ? 400 : 700"
            :size="isMobile ? 'small' : 'small'"
            v-model:checked-row-keys="checkedRowKeysRef"
            striped
            :loading="loading"
            :columns="columns"
            :data="data"
            @update:page="handlePageChange"
            :pagination="pagination"
            v-if="!error_get"
            :row-key="rowKey"
            @update:checked-row-keys="handleCheck"
          />
          <NResult
            v-else
            status="warning"
            title="Error"
            description="Error fetching data."
          >
            <template #footer>
              <NButton @click="fetchData">
                {{ t('common.tryAgain') }}
              </NButton>
            </template>
          </NResult>
          <NModal
            v-model:show="modelStore.showModelAdd"
            :mask-closable="false"
            :auto-focus="false"
            preset="card"
            style="width: 95%; max-width: 800px;"
          >
            <Add />
          </NModal>
          <NModal
            v-model:show="modelStore.showModelUpdate"
            :mask-closable="false"
            :auto-focus="false"
            preset="card"
            style="width: 95%; max-width: 800px;"
          >
            <Update :item="rowEdit!" />
          </NModal>
        </NSpace>
      </div>
    </div>
  </div>
</template> -->
