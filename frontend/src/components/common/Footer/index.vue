<script lang="ts" setup>
// import Logo from '@/assets/logo.jpeg'
import { t } from '@/locales'
import { useRouter } from 'vue-router'
import { SvgIcon , LanguageSelect, LogoApp } from '@/components/common'
const router = useRouter()
import { useAppStore } from '@/store'
import { onMounted, ref, watch } from 'vue'
import { useLoadingBar } from 'naive-ui';
const appStore = useAppStore()
function goReq() {
  router.push('/req')
}
interface Card {
  id: number;
  title: string;
  description: string;
  image?: string;
}

const cards = ref<Card[]>([]);

const updateCards = () => {
  cards.value = [
    {
      id: 1,
      title: t('services.homeWork'),
      description: t('services.homeWorkDesc'),

    },
    {
      id: 2,
      title: t('services.graduationResearch'),
      description: t('services.graduationResearchDesc'),

    },
    {
      id: 3,
      title: t('services.webDesign'),
      description: t('services.webDesignDesc'),

    },
    {
      id: 4,
      title: t('services.study'),
      description: t('services.studyDesc'),

    },
  ];
};


watch(() => [appStore.language], () => {
  updateCards();
});
onMounted(() => {
  updateCards();
});

async function goTo(route: string) {
  handleStart()
  await router.push(route)
  handleFinish()
}
const loadingBar = useLoadingBar()
const disabledRef = ref(true)
function handleStart() {
  loadingBar.start()
  disabledRef.value = false
}
function handleFinish() {
  loadingBar.finish()
  disabledRef.value = true
}

function goToSocialMedia(platform: string) {
  // You can add specific actions for each social media platform
  console.log(`Clicked on ${platform} icon`);
  // Example: Open the social media link
  window.open(getSocialMediaLink(platform), '_blank');
}

function getSocialMediaLink(platform: string): string {
  // Add logic to return the correct social media link based on the platform
  // For example, you can have a switch statement or a map of links
  switch (platform) {
    case 'youtube':
      return 'https://www.youtube.com/';
    case 'facebook':
      return 'https://www.facebook.com/';
    case 'whatsapp':
      return 'https://api.whatsapp.com/send?phone=966';
    // ... add more cases as needed ...
    default:
      return '#'; // Default to '#' if no match
  }
}

</script>

<template>
  <footer class="glass bg-blue-200 dark:bg-gray-950 dark:text-white rounded-lg mt-8 mb-2 shadow-lg relative overflow-hidden">

    <div class="footer p-6">
      <nav>
        <div class="gtext text-2xl font-bold">{{ t('common.nameApp') }}</div>
        <LogoApp :size="70" />
      </nav>
      <nav>
    <!-- <div class="gtext text-2xl font-bold">{{ t('app.company') }}</div>  -->
    <!-- <div  class="link link-hover text-lg underline underline-offset-4">{{ t('app.aboutUs') }}</div> 
    <div class="link link-hover text-lg underline underline-offset-4">{{ t('app.contact') }}</div>  -->
    <!-- <div  @click="() => goTo('/policies/terms-of-use')" class="link link-hover text-lg underline underline-offset-4">{{ t('app.termsOfUse') }}</div> 
    <div @click="() => goTo('/policies/privacy-policy')" class="link link-hover text-lg underline underline-offset-4">{{ t('app.privacyPolicy') }}</div>  -->
  </nav> 
  

  <!-- <nav>
      <div class="gtext text-2xl font-bold">{{ t('app.followUs') }}</div>
      <div class="grid grid-flow-col gap-4"> -->
        <!-- <div @click="() => goToSocialMedia('youtube')" class="icon-wrapper">
          <SvgIcon icon="logos:youtube-icon" />
        </div>
        <div @click="() => goToSocialMedia('facebook')" class="icon-wrapper">
          <SvgIcon icon="logos:facebook" />
        </div>
        <div @click="() => goToSocialMedia('tiktok')" class="icon-wrapper">
          <SvgIcon icon="logos:tiktok-icon" />
        </div>
        <div @click="() => goToSocialMedia('instagram')" class="icon-wrapper">
          <SvgIcon icon="skill-icons:instagram" />
        </div> -->
        <!-- <div @click="() => goToSocialMedia('whatsapp')" class="icon-wrapper">
          <SvgIcon icon="logos:whatsapp-icon" />
        </div> -->
        <!-- <div @click="() => goToSocialMedia('twitter')" class="icon-wrapper">
          <SvgIcon icon="line-md:twitter-x" />
        </div> -->
      <!-- </div>
    </nav> -->
    <div>
<LanguageSelect/>
    </div>
    </div>
    <div class="footer footer-center p-4 text-center">
      <aside>
        <p>{{ t('app.copyWrite') }}</p>
      </aside>
    </div>
  </footer>
</template>

<style scoped>
/* Add styles for the icon wrapper */
.icon-wrapper {
  cursor: pointer;
  font-size: 1.4rem;

}
</style>