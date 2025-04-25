<script setup lang='ts'>
import { MainHeader } from '@/components/common';
import { Footer } from '@/components/common';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';
</script>

<template>
    <div class="container pb-1 text-justify dark:bg-violet-950 dark:text-white">
        <MainHeader />
        <div class="flex flex-col justify-center items-center px-6 text-base">
            <section class="intro-section">
                <h2 class="header">{{ t('termsOfUse.introduction.title') }}</h2>
                <p>
                    {{ t('termsOfUse.introduction.paragraphs.0') }}
                </p>
                <p>
                    {{ t('termsOfUse.introduction.paragraphs.1') }}
                </p>
            </section>

            <!-- Services Section -->
            <section class="services-section">
                <h2 class="header">{{ t('termsOfUse.services.title') }}</h2>
                <p>
                    {{ t('termsOfUse.services.paragraphs.0') }}
                </p>
                <p>
                    {{ t('termsOfUse.services.paragraphs.1') }}
                </p>
                <p>
                    {{ t('termsOfUse.services.paragraphs.2') }}
                </p>
                <p>
                    {{ t('termsOfUse.services.paragraphs.3') }}
                </p>
                <p>
                    {{ t('termsOfUse.services.paragraphs.4') }}
                </p>
                <p>
                    {{ t('termsOfUse.services.paragraphs.5') }}
                </p>
            </section>

            <!-- LIMITATIONS AND RESTRICTIONS Section -->
            <section class="limitations-section">
                <h2 class="header">{{ t('termsOfUse.limitationsAndRestrictions.title') }}</h2>
                <p>
                    {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.0') }}
                </p>
                <ul class="list-disc ml-6">
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.1') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.2') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.3') }}</li>
                </ul>
                <div class="font-bold text-warning py-4">{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.4') }}</div>
                <ul class="list-disc ml-6">
                    <li> {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.5') }}</li>
                    <li> {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.6') }}</li>
                    <li> {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.7') }}</li>
                    <li> {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.8') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.9') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.10') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.11') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.12') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.13') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.14') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.15') }}</li>
                    <li>{{ t('termsOfUse.limitationsAndRestrictions.paragraphs.16') }}</li>
                </ul>
                <p class="pt-4">
                    {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.17') }}
                </p>
                <p>
                    {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.18') }}
                </p>
                <p>
                    {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.19') }}
                </p>
                <p>
                    {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.20') }}
                </p>
                <p>
                    {{ t('termsOfUse.limitationsAndRestrictions.paragraphs.21') }}
                </p>
            </section>


            <section class="refund-policy-section">
                <h2 class="header">{{ t('termsOfUse.refundPolicy.title') }}</h2>
                <p>
                    {{ t('termsOfUse.refundPolicy.paragraphs.0') }}
                </p>

            </section>

            <section class="third-parties-section">
                <h2 class="header">{{ t('termsOfUse.thirdParties.title') }}</h2>
                <p>
                  {{ t('termsOfUse.thirdParties.paragraphs.0') }}
                </p>

            </section>

            <section class="proprietary-rights-section">
                <h2 class="header">{{ t('termsOfUse.proprietaryRights.title') }}</h2>
                <p>
                    {{ t('termsOfUse.proprietaryRights.paragraphs.0') }}
                </p>
                <p>
                    {{ t('termsOfUse.proprietaryRights.paragraphs.1') }}
                </p>
         
            </section>


        </div>
        <Footer />
    </div>
</template>
  
<style scoped>
.header{
  @apply text-xl font-bold mt-6 mb-2  text-blue-800 dark:text-yellow-400;
}
li{
    @apply mx-8
}
</style>