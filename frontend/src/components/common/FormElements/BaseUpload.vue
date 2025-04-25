<script setup lang="ts">
import { supabase } from '@/utils/supabase';
import { NUpload, UploadCustomRequestOptions } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { ListType } from 'naive-ui/es/upload/src/interface';
import { defineEmits, defineProps } from 'vue';

const message = useMessage();

const props = defineProps<{
  accept?: string;
  listType?:ListType | undefined;
  bucket: string;
}>();
const accept = props.accept ?? 'image/*';
const listType = props.listType ?? 'image-card';
const emit = defineEmits(['upload-success']); 

const customRequest = async ({ file, data: dataParams, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  try {
    const progressEvent = { loaded: 20, total: 100 };
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    onProgress({ percent: percentCompleted });

    const { data, error } = await supabase.storage.from(dataParams.bucket).upload(`${file.name}`, file.file!, {
      cacheControl: '3600',
      upsert: false
    });

    if (error) {
      if (error.statusCode === '409' && error.error === 'Duplicate') {
        onFinish();
        emit('upload-success', file.name);
      } else {
        throw error;
      }
    }

    if (data) {
      onFinish();
      emit('upload-success', file.name); 
    }
  } catch (error: any) {
    message.error(error.message);
    onError();
  }
};
</script>

<template>
  <NUpload
    :accept="accept"
    :list-type="listType"
    :max="1"
    :data="{ bucket: bucket }"
    :custom-request="customRequest"
  />
</template>
