// ✅ 文件：src/stores/appStore.ts
import { defineStore } from 'pinia'

export interface MenuItem {
  id: number
  menu_id: number
  name: string
  model?: string
  view_type?: string
  view_id?: number
  action_id?: number
  action_model?: string
  path?: string
  children?: MenuItem[]
  [key: string]: any
}

export const useAppStore = defineStore('app', {
  state: () => ({
    menuTree: [] as MenuItem[],
    user: null
  }),

  persist: {
    paths: ['menuTree'] // ✅ 正确放在 defineStore 配置项中
  }
})
