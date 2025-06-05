import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../views/projects/ProjectList.vue'),
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: () => import('../views/projects/ProjectDetail.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/auth/Login.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/auth/Register.vue'),
      }
    ]
  }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/notFound/index.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
