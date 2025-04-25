import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { setupPageGuard } from './permission'
// import { ChatLayout } from '@/views/chat/layout'
import { AdminLayout } from '@/views/admin/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/policies/privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/views/auth/PrivacyPolicy.vue'),
  },
  {
    path: '/policies/terms-of-use',
    name: 'terms-of-use',
    component: () => import('@/views/auth/TermsOfUse.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/index.vue'),
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
  },

  {
    path: '/auth/signup',
    name: 'signup',
    component: () => import('@/views/auth/signUp.vue'),
  },



  {
    path: '/admin',
    name: 'admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    redirect: '/admin/dashboard',
    children: [
        
      {
        path: '/admin/dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/dashboard/index.vue'),
     
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/users/:userType?',
        name: 'users',
        component: () => import('@/views/admin/users/List.vue'),
        meta: { requiresAuth: true },
      
      },
      {
        path: '/admin/profile',
        name: 'profile',
        component: () => import('@/views/admin/profile/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/companyai',
        name: 'companyai',
        component: () => import('@/views/admin/companyai/List.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: '/admin/modelsai',
        name: 'modelsai',
        component: () => import('@/views/admin/modelsai/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/settingsapp',
        name: 'settingsapp',
        component: () => import('@/views/admin/settings_app/index.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: '/admin/settings',
        name: 'settings',
        component: () => import('@/views/admin/settings/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/edit-terms-of-use',
        name: 'edit-terms-of-use',
        component: () => import('@/views/admin/settings_app/EditTermsOfUse.vue'), 
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/edit-privacy-policy',
        name: 'edit-privacy-policy',
        component: () => import('@/views/admin/settings_app/EditPrivacyPolicy.vue'), 
        meta: { requiresAuth: true },
      },

      {
        path: '/admin/submit-question',
        name: 'submit-question',
        component: () => import('@/views/admin/questions/Submit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/list-questions', 
        name: 'list-questions',
        component: () => import('@/views/admin/questions/List.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/questions/:id',
        name: 'question-details',
        component: () => import('@/views/admin/questions/Details.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admin/ai-settings',
        name: 'ai-settings',
        component: () => import('@/views/admin/settings_app/AISettings.vue'),
        meta: { requiresAuth: true },
      },
   
   
    ],

  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
    meta: { requiresAuth: false },
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
    meta: { requiresAuth: false },
  },


  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
