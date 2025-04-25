<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { NButton, NInput, NSlider,  NCheckbox , useMessage } from 'naive-ui'
import { useSettingStore } from '@/store'
import type { SettingsState } from '@/store/modules/settings/helper'
import { t } from '@/locales'
import SelectSystemPromt from '../../../views/chat/components/SelectOptions/SelectSystemPromt.vue'
const settingStore = useSettingStore()

const ms = useMessage()
const systemMessageValue = ref(settingStore.systemMessage ?? '');
const systemMessage = computed({
      get: () => systemMessageValue.value,
      set: (newValue) => {
        systemMessageValue.value = newValue;
        settingStore.updateSetting({ systemMessage: newValue });
      },
    });

const temperature = ref(settingStore.temperature ?? 0.5)

const top_p = ref(settingStore.top_p ?? 1)

function updateSettings(options: Partial<SettingsState>) {
  settingStore.updateSetting(options)
  ms.success(t('common.success'))
}

watch(() => settingStore.systemMessage, (newValue) => {
    
      systemMessageValue.value = newValue;
    });

function handleReset() {
  settingStore.resetSetting()
  ms.success(t('common.success'))
  window.location.reload()
}

const isEmojis = ref<boolean>(settingStore.isEmojis ?? true)

watch(() => isEmojis.value, (newValue) => {
  settingStore.updateSetting({  isEmojis: newValue });
  });

</script>

<template>


  <div class="flex">
<div>
  <NCheckbox
                    v-model:checked="isEmojis"
                    :label="t('setting.isEmojes')"
                  
                />
</div>
  </div>
  <!-- <div class="px-4 py-2 md:space-y-6 min-h-[200px]">
    <div class="space-y-2 md:space-y-6">

      <div class="flex flex-col gap-1 md:gap-0 md:flex-row md:items-center md:space-x-4">
        <span class="flex-shrink-0 w-[120px] font-bold">{{ $t('setting.select') }}</span>
        <div class="flex-1">
          <SelectSystemPromt/>
        </div>
      </div>

      <div class="flex flex-col gap-1 md:gap-0 md:flex-row md:items-center md:space-x-4">
        <span class="flex-shrink-0 w-[120px] font-bold">{{ $t('setting.role') }}</span>
        <div class="flex-1">
          <NInput v-model:value="systemMessage" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" />
        </div>
      </div>

      <div class="flex flex-col gap-1 md:gap-0 md:flex-row md:items-center md:space-x-4">
        <span class="flex-shrink-0 w-[120px] font-bold">{{ $t('setting.temperature') }} </span>
        <div class="flex-1 flex gap-4 items-center">
          <NSlider v-model:value="temperature" :max="2" :min="0" :step="0.1" />
          <div class="w-12 flex justify-end">{{ temperature }}</div>
        </div>
      </div>
      <div class="flex flex-col gap-1 md:gap-0 md:flex-row md:items-center md:space-x-4">
        <span class="flex-shrink-0 w-[120px] font-bold">{{ $t('setting.top_p') }} </span>
        <div class="flex-1 flex gap-4 items-center">
          <NSlider v-model:value="top_p" :max="1" :min="0" :step="0.1" />
          <div class="w-12 flex justify-end">{{ top_p }}</div>
        </div>
      </div>
      <div class="flex items-center space-x-4">
     

        <NButton size="medium" secondary  type="primary" @click="updateSettings({ systemMessage, temperature,top_p })">
          {{ $t('common.save') }}
        </NButton>
        <NButton size="medium" strong secondary  type="error" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>

      </div>
    </div>
  </div> -->
</template>
