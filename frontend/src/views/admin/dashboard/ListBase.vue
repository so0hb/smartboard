<template>
    <div class="p-4 bg-gray-100 min-h-screen">
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <n-switch v-model:value="isGridView" checked-value="grid" unchecked-value="list">
          <template #checked>
            <SvgIcon icon="mdi:view-grid" />
          </template>
          <template #unchecked>
            <SvgIcon icon="mdi:view-list" />
          </template>
        </n-switch>
      </div>
  
      <n-data-table
        v-if="!isGridView"
        :columns="columns"
        :data="items"
        :pagination="pagination"
        :bordered="false"
        :striped="true"
      />
  
      <!-- <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <n-card v-for="item in items" :key="item[keyField]" class="h-full">
          <template v-for="column in columns" :key="column.key">
            <div v-if="column.key !== keyField" class="mb-2">
              <strong>{{ column.title }}:</strong>
              <component
                v-if="column.render"
                :is="column.render(item)"
              />
              <template v-else>
                {{ item[column.key] }}
              </template>
            </div>
          </template>
        </n-card>
      </div> -->
  
      <n-pagination
        v-model:page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :item-count="totalItems"
        :page-sizes="[10, 20, 30, 40]"
        show-size-picker
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { NDataTable, NCard, NPagination, NSwitch } from 'naive-ui'
  import type { DataTableColumns } from 'naive-ui'
  import { SvgIcon } from '@/components/common';
  interface Props {
    title: string
    items: any[]
    columns: DataTableColumns
    keyField: string
    totalItems: number
  }
  
  const props = withDefaults(defineProps<Props>(), {
    title: 'List',
    keyField: 'id'
  })
  
  const emit = defineEmits(['update:page', 'update:pageSize'])
  
  const isGridView = ref('list')
  const pagination = ref({
    page: 1,
    pageSize: 10
  })
  
  const onPageChange = (page: number) => {
    pagination.value.page = page
    emit('update:page', page)
  }
  
  const onPageSizeChange = (pageSize: number) => {
    pagination.value.pageSize = pageSize
    emit('update:pageSize', pageSize)
  }
  
  const paginatedItems = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    return props.items.slice(start, end)
  })
  </script>