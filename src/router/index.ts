import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      title: 'Home - Vue 3 Template',
      description: 'Welcome to the Vue 3 + TypeScript + Vuestic UI Template'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: {
      title: 'Dashboard - Vue 3 Template',
      description: 'Real-time overview of your application'
    }
  },
  {
    path: '/components',
    name: 'Components',
    component: () => import('@/pages/ComponentsPage.vue'),
    meta: {
      title: 'Components - Vue 3 Template',
      description: 'Explore UI components and their usage patterns'
    }
  },
  {
    path: '/forms',
    name: 'Forms',
    component: () => import('@/pages/FormsPage.vue'),
    meta: {
      title: 'Forms - Vue 3 Template',
      description: 'Learn form handling with validation and error handling'
    }
  },
  {
    path: '/data',
    name: 'Data',
    component: () => import('@/pages/DataPage.vue'),
    meta: {
      title: 'Data Management - Vue 3 Template',
      description: 'See data management patterns and state handling'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: '404 - Page Not Found',
      description: 'The page you are looking for does not exist'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
