
<script lang="ts" setup>
import {
  injectStrict,
  UserContextProviderInjection,
  UserContextProviderKey
} from '@nuxtbase/auth-ui-vue'

const { user } = injectStrict<UserContextProviderInjection>(
  UserContextProviderKey
)
</script>


<template>
     {{ user?.id }}
    {{ user?.email }}
  </template>
  
