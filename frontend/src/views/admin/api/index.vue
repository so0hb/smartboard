<script setup lang='ts'>
import { ref, h, onMounted, computed,reactive } from 'vue'
import {
  NSpace, NButton, NDataTable, DataTableBaseColumn,
  useDialog, NEmpty,NResult,
  DataTableRowKey, NModal,
  useMessage, DataTableFilterState, DataTableColumns,
} from 'naive-ui'
import { useUsersStore } from '@/store'
import { t } from '@/locales';
import { useIconRender } from '@/hooks/useIconRender'
import { useBasicLayout } from '@/hooks/useBasicLayout';
// import CardUnversity from './CardUnversity.vue'
// import { FilterTable } from './components/index'
import { SvgIcon } from '@/components/common';
// import AddUniversity from './AddUniversity.vue'
// import UpdateUniversity from './UpdateUnversity.vue'

const { iconRender } = useIconRender()
const loadingActionDelete = ref(false)
const loadingActionEdit = ref(false)
const loading = ref(true)
const error_get = ref<boolean>(false)
const universityStore = useUsersStore()
const checkedRowKeysRef = ref<Array<string | number>>([])
const { isMobile } = useBasicLayout()
const dialog = useDialog()
const message = useMessage();
const rowEdit = ref<Research.University | null>(null);
const data = computed(() => universityStore.listUsers)
const pageSize:number = 3
const pages = computed(() => universityStore.countTotalData)
const pagination = reactive({
  page: pages!,
  pageSize:pageSize,
  showSizePicker: true,
  // pageSizes: [3, 5, 7],
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  }
})
function handleDeleteAction(row: Research.University) {
  const deleteDialog = dialog.warning({
    title: t('chat.deleteConfirmation'),
    content: t('chat.deleteConfirmationMessage'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        deleteDialog.loading = true
        await universityStore.deleteDataAction(row.id!)
        message.success(t('chat.deleteSuccess'));
      } catch (error: any) {
        deleteDialog.loading = false
        message.error(t('chat.deleteFailed'));
      } finally {
        deleteDialog.loading = false
      }
    },
  });
}

async function handleUpdateUniversity(row: Research.University) {
  universityStore.showUpdate = true;
  rowEdit.value = row;
}

const mainColumn = reactive<DataTableBaseColumn<Research.University>>({
  title: t('university.university'),
  key: 'university',
  render(row: Research.University) {
    return h(
      CardUnversity,
      {
        row: row
      },
    )
  },
})

const columns = reactive<DataTableColumns<Research.University>>([
  {
    type: 'selection',
    options: [
      'all',
      'none',
    ],
    disabled(row: Research.University) {
      return row.type_added === 'default'
    }
  },
  mainColumn,
  {
    title: t('research.actions'),
    key: 'actions',
    align: 'center',
    width: 100,
    render(row: Research.University) {
      return h(
        'div',
        {
          class: 'flex gap-1'
        },
        [
          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              loading: loadingActionEdit.value,
              style:"border-radius:100%",
              onClick: async () => {
                try {
                  await handleUpdateUniversity(row);
                } catch (error: any) {

                  console.error(t('common.updateFailed'), error.message);
                }
              }
            },
            { default: () => h(iconRender({ icon: 'fluent:edit-32-regular', color: 'blue' })) }
          ),

          h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              loading: loadingActionDelete.value,
              onClick: () => handleDeleteAction(row)
            },
            { default: () => h(iconRender({ icon: 'fluent:delete-32-regular', color: 'red' })) }
          ),

        ]
      );
    }
  },

]);



async function getDataAsync() {
  try {
    await universityStore.fetchDataAction({ limit: pageSize, offset: 1 })
    loading.value = true
    loading.value = false
    error_get.value = false
  } catch (error: any) {
    message.error(t('common.errorSomeThing') + " " + error.message);
    console.error(t('common.errorSomeThing'), error.message);
    console.error(error_get.value);
    error_get.value = true
    console.error(error_get.value);
    loading.value = false

  }
}
// async function handlePageChange() {
//   try {
//     loading.value = true
//     await universityStore.fetchUniversitiesAction(universityStore.listUniversity.length, universityStore.listUniversity.length + pageSize);
//     loading.value = false
//     error_get.value = false
//   } catch (error: any) {
//     message.error(t('common.errorSomeThing') + " " + error.message);
//     console.error(t('common.errorSomeThing'), error.message);
//     error_get.value = true
//     loading.value = false

//   }
// }




onMounted(async () => {
  // if(!universityStore.countTotalData){
  // await  universityStore.countTotalDataAction()
  // }
 getDataAsync();
})
const dataTableInstRef = ref(null)
const dataTableInst = dataTableInstRef


function handleUpdateFilter(
  filters: DataTableFilterState,
  sourceColumn: DataTableBaseColumn
) {
  mainColumn.filterOptionValue = filters[sourceColumn.key] as string
}


const columnsRef = ref(columns)

function handleSorterChange(sorter: any) {
  columnsRef.value.forEach((column) => {
    if (column.sortOrder === undefined) return
    if (!sorter) {
      column.sortOrder = false
      return
    }
    if (column.key === sorter.columnKey) column.sortOrder = sorter.order
    else column.sortOrder = false
  })
}

const rowKey = (row: Research.University) => row.id!;

function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRowKeysRef.value = rowKeys
}

function deleteSelectedRows() {
  const deleteDialog = dialog.warning({
    title: t('chat.deleteConfirmation'),
    content: t('chat.deleteConfirmationMessage'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        deleteDialog.loading = true;
        const deletePromises = checkedRowKeysRef.value.map((id) =>
          universityStore.deleteDataAction(id as unknown as number)
        );
        await Promise.all(deletePromises);
        message.success(t('chat.deleteSuccess'));
      } catch (error: any) {
        console.error(t('common.deleteFailed'), error.message);
        message.error(t('common.deleteFailed'));
      } finally {
        deleteDialog.loading = false;
      }
    },
  });
}



</script>
<template>
  <div class="container_dashboard">

    <div class="header_dashboard">
        {{ t('university.universitys') }}
      </div>

  
      <div class="flex gap-2 justify-end items-center">
        <NButton
          @click="universityStore.showAdd = true"
          type="primary"
        >
          <div class="flex gap-2  items-center">
            <SvgIcon
              icon="mdi:add-bold"
              class=" text-base"
            />
            <div class="hidden md:block">{{ t('university.addUniversity') }}</div>
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
        <div class="cursor-pointer">
          <FilterTable
            :mainColumn="mainColumn"
            :columns="columns"
          />
        </div>
      </div>

    <div class="">
      <NSpace
        vertical
        :size="12"
      >
        <template v-if="error_get">
          <div class=" border-red-400 bg-red-100 p-4 rounded-lg ">
          
  <NResult status="error" title="Error" description="It's red">
    <template #footer>
      <NButton
                size="small"
                :loading="loading"
                @click="getDataAsync()"
              >
               try Again
              </NButton>
    </template>
  </NResult>

          <!-- <NEmpty description="Custom your icon">
            <template #icon>
              <SvgIcon
                icon="mdi:add-bold"
                class=" text-base"
              />
            </template>
            <template #extra>
              <NButton
                size="small"
                :loading="loading"
                @click="getDataAsync()"
              >
                Find Something New
              </NButton>
            </template>
          </NEmpty> -->
        </div>
        </template>
        <template v-if="!error_get">
          <NDataTable
          remote
            :size="isMobile ? 'small' : 'small'"
            striped
            :loading="loading"
            ref="dataTableInst"
            :columns="columns"
            :data="data"
            :pagination="pagination"
            :max-height="isMobile ? 400 : 370"
            :min-height="isMobile ? 380 : 370"
            :paginate-single-page=false
            v-model:checked-row-keys="checkedRowKeysRef"
            @update:filters="handleUpdateFilter"
            @update:sorter="handleSorterChange"
            :row-key="rowKey"
            @update:checked-row-keys="handleCheck"
          />
        </template>
      </NSpace>
    </div>
  </div>

  <div>
    <!-- <NModal
      v-model:show="universityStore.showModelAdd"
      :mask-closable=false
      :auto-focus="false"
      preset="card"
      style="width: 95%; max-width: 640px;"
    >
      <AddUniversity />
    </NModal>
    <NModal
      v-model:show="universityStore.showModelUpdate"
      :mask-closable=false
      :auto-focus="false"
      preset="card"
      style="width: 95%; max-width: 640px;"
    >
      <UpdateUniversity
        :row="rowEdit!"
      
      />
    </NModal> -->

</div>

</template>

<style scoped>
:deep(th) {
  font-weight: bold;
font-size: 1rem;

}

</style>
