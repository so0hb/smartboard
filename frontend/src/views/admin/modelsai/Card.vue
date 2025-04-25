<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { NTooltip, NAvatar, NBadge, NEllipsis, NSpin } from 'naive-ui'
import { t } from '@/locales';
import { SvgIcon } from '@/components/common';
import { useCompanyStore } from '@/store';
import { getImageUrl } from '@/utils/supabaseHelper';

interface Props {
    companyId: string
}

const props = defineProps<Props>()
const companyStore = useCompanyStore();
const row = ref<API.CompanyAI | null>(null);
const loading = ref<boolean>(false);

async function fetchData(): Promise<void> {
  loading.value = true;
  try {
    await companyStore.fetchDataAction({ limit: 1000, offset: 0 });
    companyStore.listData = await Promise.all(companyStore.listData.map(async (company) => {
      if (company.logoUrl) {
        try {
          company.logoUrl = await getImageUrl(companyStore.bucket, company.logoUrl);
        } catch (error) {
          console.error(`Failed to fetch image for company ${company.name}:`, error);
        }
      }
      return { ...company };
    }));
  } catch (error: any) {
    console.error(t('chat.dataFetchError'), error.message);
  } finally {
    loading.value = false;
  }
}

async function initializeCompany() {
  // Check if the company already exists in the list
  let foundCompany = companyStore.listData.find(company => company.id === props.companyId);

  // If not found, fetch the data
  if (!foundCompany) {
    await fetchData();
    foundCompany = companyStore.listData.find(company => company.id === props.companyId);
  }

  // Set the row data
  if (foundCompany) {
    row.value = foundCompany;
  } else {
    console.error(`Company with ID ${props.companyId} not found`);
  }
}

onMounted(initializeCompany);

const badgeType = computed(() => row.value?.isActivate ? 'success' : 'error');
const { isMobile } = useBasicLayout();
</script>

<template>
 
    <NSpin v-if="loading" size="small" />


  <div v-else-if="row" class="flex gap-4 item-center">
    <NBadge
      dot
      :processing=false
      :type='badgeType'
    >
      <NAvatar
        round
        size="medium"
        :src="row.logoUrl"
      />
    </NBadge>

    <div class="flex flex-col">
      <div class="font-bold text-base">
        <NEllipsis :line-clamp="1">
          {{ row.name }} 
          <template #tooltip>
            <div class="w-36">
              {{ row.name }} 
            </div>
          </template>
        </NEllipsis>
      </div>
    </div>
  </div>

  <div v-else>
    <p>{{ t('common.companyNotFound') }}</p>
  </div>
</template>

