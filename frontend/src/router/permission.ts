import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    const isAuthenticated = authStore.isAuthenticated()
     const userStore = useUserStore()
         
    const userRole = userStore.user?.role || null

    // Require authentication for protected routes
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next({ name: 'auth' }) // Redirect to login if not authenticated
    }

    // if (to.path.startsWith('/admin') && userRole === 'admin') {
    //   return next({ name: 'home' }) // Redirect non-admin users to home
    // }

    // Prevent logged-in users from accessing auth pages
    if (isAuthenticated && ['auth', 'signup', 'login', 'otp'].includes(to.name as string)) {


          // Restrict access to admin routes
  
      return next({ name: 'dashboard' }) // Redirect logged-in users to dashboard
    }

    next()
  })
}
