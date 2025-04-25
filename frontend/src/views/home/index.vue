<script lang="ts" setup>
import { h } from 'vue'
import Hero from './Hero.vue'

import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NMenu, NButton, NCard, NIcon, NRate } from 'naive-ui'
import { 
  ChatboxEllipsesOutline, 
  SchoolOutline,
  DocumentTextOutline,
  SparklesOutline,
  PersonCircleOutline,
  CheckmarkCircleOutline,
  TrophyOutline,
  AnalyticsOutline,
  FlagOutline
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'



const keyFeatures = [
  {
    title: 'AI-Driven Moderation',
    description: 'Automatically filter duplicate comments and flag inappropriate content to keep discussions focused and respectful.',
    icon: FlagOutline
  },
  {
    title: 'Personalized Engagement',
    description: 'Get tailored discussion prompts and responses based on your preferences to keep conversations relevant and engaging.',
    icon: ChatboxEllipsesOutline
  },
  {
    title: 'Gamification & Rewards',
    description: 'Motivate participation with leaderboards, achievements, and rewards for high engagement.',
    icon: TrophyOutline
  },
  {
    title: 'Insightful Analytics',
    description: 'Track engagement trends and optimize strategies with real-time AI-driven analytics.',
    icon: AnalyticsOutline
  }
]

const testimonials = [
  {
    name: 'Dr. Emily Carter',
    comment: 'SmartBoard AI has transformed my classroom discussions. The AI moderation saves me hours, and students are more engaged than ever!',
    rating: 5
  },
  {
    name: 'John Martinez',
    comment: 'The gamification features are a game-changer. My students are competing to contribute meaningfully to discussions.',
    rating: 5
  },
  {
    name: 'Sarah Lee',
    comment: 'The personalized suggestions keep discussions fresh and relevant. Highly recommend SmartBoard AI for educators!',
    rating: 4
  }
]

const router = useRouter()

function goReq() {
  router.push('/req')
}
</script>

<template>
  <MainHeader/>
  <Hero/>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100">
  
   
    <n-layout>
    

      <n-layout-content>


        <!-- Key Features Section -->
        <section class="py-16 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <div class="container mx-auto">
            <h3 class="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              Key Features
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <n-card v-for="feature in keyFeatures" :key="feature.title">
                <template #cover>
                  <div class="h-40 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
                    <n-icon size="48" :component="feature.icon" />
                  </div>
                </template>
                <h4 class="text-xl font-semibold mb-2">{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </n-card>
            </div>
          </div>
        </section>

        <!-- Why Choose SmartBoard AI? -->
        <section class="py-16">
          <div class="container mx-auto">
            <h3 class="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Why Choose SmartBoard AI?
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <n-icon size="36" color="#10B981">
                    <CheckmarkCircleOutline />
                  </n-icon>
                </div>
                <div>
                  <h4 class="text-xl font-semibold mb-2">Automated Moderation</h4>
                  <p>Reduce manual effort with AI-powered content filtering and moderation.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <n-icon size="36" color="#3B82F6">
                    <SparklesOutline />
                  </n-icon>
                </div>
                <div>
                  <h4 class="text-xl font-semibold mb-2">Engagement Boost</h4>
                  <p>Keep students engaged with personalized suggestions and gamification.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <n-icon size="36" color="#8B5CF6">
                    <AnalyticsOutline />
                  </n-icon>
                </div>
                <div>
                  <h4 class="text-xl font-semibold mb-2">Data-Driven Insights</h4>
                  <p>Gain actionable insights with real-time analytics on engagement trends.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <n-icon size="36" color="#EC4899">
                    <TrophyOutline />
                  </n-icon>
                </div>
                <div>
                  <h4 class="text-xl font-semibold mb-2">Rewards System</h4>
                  <p>Recognize and reward active participants to foster a vibrant community.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

    
      </n-layout-content>

   
    
   
    <Footer/>
    </n-layout>
  </div>
</template>