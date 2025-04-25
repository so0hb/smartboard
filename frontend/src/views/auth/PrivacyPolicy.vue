<script setup lang='ts'>
import { MainHeader } from '@/components/common';
import { Footer } from '@/components/common';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';

const text = t('privacyPolicy.contactInformation.content')
</script>
<template>
    <div class="container pb-1 dark:bg-violet-950 dark:text-white">
      <MainHeader/>
      <div class="flex flex-col px-6 text-base text-justify">
        <h1 class="text-3xl font-bold mb-4 gtext">{{ t('privacyPolicy.privacyPolicyHeader') }}</h1>
        <p>{{ t('privacyPolicy.content.paragraph1') }}</p>
        <p>{{ t('privacyPolicy.content.paragraph2') }}</p>
  
        <h2 class="header">{{ t('privacyPolicy.typesOfInformation.title') }}</h2>
  
        <!-- Information you supply to us -->
        <h3 class="text-lg font-bold mt-4 mb-2">{{ t('privacyPolicy.typesOfInformation.informationYouSupply.title') }}</h3>
        <p>{{ t('privacyPolicy.typesOfInformation.informationYouSupply.content') }}</p>
  
        <!-- How we may use the information we collect -->
        <h2 class="header">{{ t('privacyPolicy.howWeMayUse.title') }}</h2>
  
        <!-- Information you supply to us -->
        <h3 class="text-lg font-bold mt-4 mb-2">{{ t('privacyPolicy.howWeMayUse.informationYouSupply.title') }}</h3>
        <p>{{ t('privacyPolicy.howWeMayUse.informationYouSupply.content') }}</p>
        <ul class="list-disc ml-6">
          <li>{{ t('privacyPolicy.howWeMayUse.informationYouSupply.points.0') }}</li>
          <li>{{ t('privacyPolicy.howWeMayUse.informationYouSupply.points.1') }}</li>
        </ul>
  
        <!-- Disclosure of your information -->
        <h2 class="header">{{ t('privacyPolicy.disclosure.title') }}</h2>
        <p>{{ t('privacyPolicy.disclosure.content') }}</p>
  
        <!-- Security Note -->
        <p class="mt-4">{{ t('privacyPolicy.securityNote') }}</p>
  
        <!-- Your rights – access to your personal data -->
        <h2 class="header">{{ t('privacyPolicy.yourRights.title') }}</h2>
        <p>{{ t('privacyPolicy.yourRights.content') }}</p>
  
        <!-- Changes to our privacy policy -->
        <h2 class="header">{{ t('privacyPolicy.changesToPrivacyPolicy.title') }}</h2>
        <p>{{ t('privacyPolicy.changesToPrivacyPolicy.content') }}</p>
  
        <!-- Contact Information -->
        <!-- <h2 class="header">{{ t('privacyPolicy.contactInformation.title') }}</h2> -->
        <!-- <p v-html="text"></p> -->
  
      </div>
  
      <!-- Footer -->
      <Footer/>
  
    </div>
  </template>
  
<style scoped>
.header{
  @apply text-xl font-bold mt-6 mb-2  text-blue-800  dark:text-yellow-400;
}
</style>