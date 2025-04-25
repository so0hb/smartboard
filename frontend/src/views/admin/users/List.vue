<script setup lang='ts'>
import { ref, h, onMounted, computed, reactive } from 'vue'
import {
  NSpace, NButton, NDataTable, DataTableBaseColumn,
  useDialog, NEmpty, NResult,
  DataTableRowKey, NModal,NBreadcrumb,NBreadcrumbItem,
  useMessage, DataTableFilterState, DataTableColumns,
} from 'naive-ui'
import { useUsersStore, useUserStore } from '@/store'
import { t } from '@/locales';
import { useIconRender } from '@/hooks/useIconRender'
import { useBasicLayout } from '@/hooks/useBasicLayout';
import Card from './Card.vue'
import { FilterTable } from './components/index'
import { SvgIcon } from '@/components/common';
import Add from './Add.vue'
import Update from './Update.vue'
import { useRoute } from 'vue-router';
import { getImageUrl } from '@/utils/supabaseHelper';

const { iconRender } = useIconRender()
const route = useRoute()
let { userType } = route.params as { userType: string };

const loadingActionDelete = ref(false)
const loadingActionEdit = ref(false)
const loading = ref(true)
const error_get = ref<boolean>(false)
const usersStore = useUsersStore()
const checkedRowKeysRef = ref<Array<string | number>>([])
const { isMobile } = useBasicLayout()
const dialog = useDialog()
const message = useMessage();
const rowEdit = ref<API.UserData | null>(null);

const data = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  // return  usersStore.listUsers.slice(start, end);
  return usersStore.listUsers.filter(user => user.role === userType).slice(start, end);
 
});

const pageSize = ref(10);
const itemCount = computed(() => usersStore.countTotalData);
const pagination = reactive({
  page: 1,
  pageCount: computed(() => Math.ceil(itemCount.value / pageSize.value)),
  pageSize: pageSize.value,
});


const title = computed(() => {
 
 switch (userType) {
   case 'students':
     return t('common.users');
   case 'instructors':
     return t('common.instructors');
   case 'admins':
     return t('common.admins');
   default:
     return ''
 
}
})
function handleDeleteAction(row: API.UserData) {
  const deleteDialog = dialog.warning({
    title: t('chat.deleteConfirmation'),
    content: t('chat.deleteConfirmationMessage'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        deleteDialog.loading = true
        await usersStore.deleteDataAction(row.id!)
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

async function handleUpdate(row: API.UserData) {
  usersStore.showUpdate = true;
  rowEdit.value = row;
}

const mainColumn = reactive<DataTableBaseColumn<API.UserData>>({
  title: title.value,
  key: 'users',
  render(row: API.UserData) {
    return h(
      Card,
      {
        row: row
      },
    )
  },
})
const userStore = useUserStore();
const myUserId = computed(() => userStore.$state.user?.id);


const columns = reactive<DataTableColumns<API.UserData>>([
  {
    type: 'selection',


  },
  mainColumn,
  {
    title: t('common.actions'),
    key: 'actions',
    align: 'center',
    width: 100,
    render(row: API.UserData) {
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
              disabled: row.id === myUserId.value, 
              size: 'small',
              loading: loadingActionEdit.value,
              style: "border-radius:100%",
              onClick: async () => {
                try {
                  await handleUpdate(row);
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
              disabled: row.id === myUserId.value, 
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



// async function getDataAsync() {
//   try {
//     loading.value = true
//     await usersStore.fetchDataAction({ limit: pageSize, offset: 1, userType: userType })
//     loading.value = false
//     error_get.value = false
//   } catch (error: any) {
//     message.error(t('common.errorSomeThing') + " " + error.message);
//     console.error(t('common.errorSomeThing'), error.message);
//     console.error(error_get.value);
//     error_get.value = true
//     console.error(error_get.value);
//     loading.value = false

//   }
// }

async function fetchData(): Promise<void> {
  try {
    loading.value = true;
    const { page, pageSize } = pagination;
    await usersStore.fetchDataAction({ limit: pageSize, offset: (page - 1) * pageSize, userType: userType });
    // await usersStore.fetchDataAction({  limit: 1000, offset: 0 , userType: userType });
    
    // Resolve image URLs for each company
    usersStore.listUsers = await Promise.all(usersStore.listUsers.map(async (user) => {
      // Check if logoUrl is present
      if (user.avatarUrl && user.avatarUrl != '') {
        try {
          user.avatarUrl = await getImageUrl(usersStore.bucket ,user.avatarUrl);
        } catch (error) {
          console.error(`Failed to fetch image for user ${user.firstName}:`, error);

        }
      }

      return {
        ...user
      };
    }));

        loading.value = false
    error_get.value = false

     
  
  } catch (error: any) {
    error_get.value = true;
    console.error(t('chat.dataFetchError'), error.message);
  } finally {
    loading.value = false;
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
  await fetchData();

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

const rowKey = (row: API.UserData) => row.id!;

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
          usersStore.deleteDataAction(id)
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

function handlePageChange(currentPage: number) {
  pagination.page = currentPage;
  fetchData();
}

const breadcrumbs = computed(() => {
  return [
    { label: 'Home', to: '/' },
    { label: route.params.userType === 'Client' ? 'Users' : route.params.userType, to: '/users' },
    { label: usersStore.showAdd ? 'Add' : usersStore.showUpdate ? 'Edit' : 'List', to: null }
  ];
});
</script>
<template>
  <div class="container_dashboard">

    <div class="header_dashboard">
      {{ title }}
    </div>

    <!-- <NBreadcrumb>
      <NBreadcrumbItem v-for="(item, index) in breadcrumbs" :key="index" :to="item.to">
        {{ item.label }}
      </NBreadcrumbItem>
    </NBreadcrumb> -->

<!-- <template> -->
    <div  class="flex gap-2 justify-end items-center my-2">
      <NButton
        @click="usersStore.showAdd = true; usersStore.showList = false;"
        type="primary"
      >
        <div class="flex gap-2  items-center">
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
      <!-- <div class="cursor-pointer">
          <FilterTable
            :mainColumn="mainColumn"
            :columns="columns"
          />
        </div> -->
    </div>

    <div class="">
      <NSpace
        vertical
        :size="12"
      >
        <template v-if="error_get">
          <div class=" border-red-400 bg-red-100 p-4 rounded-lg ">

            <NResult
              status="error"
              title="Error"
              description="It's red"
            >
              <template #footer>
                <NButton
                  size="small"
                  :loading="loading"
                  @click="fetchData()"
                >
                  {{ t('common.tryAgain') }}
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

            remote
          
           
           
            @update:filters="handleUpdateFilter"
            @update:sorter="handleSorterChange"
          
          
          />
        </template>
      </NSpace>
    </div>
  <!-- </template> -->


  <!-- <template v-if="usersStore.showAdd" >
      <Add  userType="userType" />
    </template>
    <template v-if="usersStore.showUpdate" >
      <Update  :item="rowEdit!" />
    </template> -->

    <NModal
      v-model:show="usersStore.showAdd"
      :mask-closable=false
      :auto-focus="false"
      preset="card"
      style="width: 95%; max-width: 640px;"
    >
      <Add :userType="userType" />
    </NModal> 
   
  <NModal
      v-model:show="usersStore.showUpdate"
      :mask-closable=false
      :auto-focus="false"
      preset="card"
      style="width: 95%; max-width: 640px;"
    >
      <Update :item="rowEdit!" />
    </NModal>

 
</div>
</template>

<style scoped>
th {
  font-weight: bold;
  font-size: 1rem;

}
</style>