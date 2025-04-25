<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { t } from '@/locales'
const typeValue = ref<string>('');
const typeStatus = ref<boolean>(false);
const displayTextArray = ref<string[]>([]);
const updateDisplayTextArray = () => {
  displayTextArray.value = [
    t('services.homeWork'),
    t('services.graduationResearch'),
    t('services.study'),
    t('services.webDesign')
  ];
};
import { useAppStore } from '@/store'
const appStore = useAppStore()
const typingSpeed = 100;
const erasingSpeed = 100;
const newTextDelay = 2000;
let displayTextArrayIndex = 0;
let charIndex = 0;

const typeText = () => {
  if (charIndex < displayTextArray.value[displayTextArrayIndex].length) {
    if (!typeStatus.value) typeStatus.value = true;
    typeValue.value += displayTextArray.value[displayTextArrayIndex].charAt(charIndex);
    charIndex += 1;
    setTimeout(typeText, typingSpeed);
  } else {
    typeStatus.value = false;
    setTimeout(eraseText, newTextDelay);
  }
};

const eraseText = () => {
  if (charIndex > 0) {
    if (!typeStatus.value) typeStatus.value = true;
    typeValue.value = displayTextArray.value[displayTextArrayIndex].substring(0, charIndex - 1);
    charIndex -= 1;
    setTimeout(eraseText, erasingSpeed);
  } else {
    typeStatus.value = false;
    displayTextArrayIndex += 1;
    if (displayTextArrayIndex >= displayTextArray.value.length) displayTextArrayIndex = 0;
    setTimeout(typeText, typingSpeed + 1000);
  }
};

watch(() => [appStore.language], () => {
  updateDisplayTextArray();
});

onMounted(() => {
  updateDisplayTextArray();
  setTimeout(typeText, newTextDelay + 200);
});
// Help You For 
</script>

<template>
  <div class="text-2xl">
    <div class="text-3xl  h-36 md:text-6xl font-bold text-blue-500">
        <div >{{ t('home.helpForYou') }} </div>
      <span class="typed-text">{{ typeValue }}</span>
      <span class="blinking-cursor">|</span>
      <div class="cursor" :class="{ typing: typeStatus }">&nbsp;</div>
    </div>
  </div>
</template>

