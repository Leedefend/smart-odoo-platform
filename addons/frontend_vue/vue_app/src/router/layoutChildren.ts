// src/router/layoutChildren.ts
import type { RouteRecordRaw } from 'vue-router'

export const layoutChildren: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: 'home',
    name: 'home',
    component: () => import('@/views/HomePage.vue')
  }
]
