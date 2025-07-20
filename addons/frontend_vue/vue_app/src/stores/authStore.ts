// ✅ 文件：src/stores/authStore.ts
import { defineStore } from 'pinia'
import { apiRequest } from '@/api/base'
import { useAppStore } from './appStore'
import { buildDynamicRoutesFromMenuTree } from '@/router/dynamicRoutes'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || '',
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    menuTree: [] as any[],
    activeMenuId: null,        // ✅ 当前激活菜单 ID（用于匹配与高亮）
    activeMainMenu: null,      // ✅ 当前主菜单（用于顶部子菜单展开）
    topMenuChildren: []        // ✅ 顶部菜单显示的子级
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    /**
     * ✅ 登录并初始化系统菜单与动态路由
     */
    setMenuTree(tree) {
      this.menuTree = tree
    },
    setActiveMenu(menu) {
      this.activeMenuId = menu?.id || null
      this.activeMainMenu = menu
      this.topMenuChildren = menu.children || []
    },
  
    async login(username: string, password: string) {
      try {
        const res = await apiRequest('/api/auth/login', 'POST', { username, password })
        if (!res?.token || !res?.user) {
          console.error('❌ 登录返回内容无效:', res)
          return false
        }

        this.token = res.token
        this.user = res.user
        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('auth_user', JSON.stringify(this.user))

        // ✅ 拉取菜单结构
        const appStore = useAppStore()
        const menuRes = await apiRequest('/api/user_menus', 'GET')
        this.menuTree = menuRes
        appStore.menuTree = menuRes

        // ✅ 注册动态路由
        const dynamicRoutes = buildDynamicRoutesFromMenuTree(menuRes)
        dynamicRoutes.forEach(route => router.addRoute(route))

        console.log('✅ 登录返回数据:', res)
        console.log('✅ 最终是否成功:', true)

        // ✅ 自动跳转第一个有效菜单
        const firstMenu = this.findFirstNavigableMenu(menuRes)
        if (firstMenu) {
          await this.navigateToMenu(firstMenu.menu_id, firstMenu.action_id)
        }

        return true
      } catch (err) {
        console.error('❌ 登录失败:', err)
        return false
      }
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    /**
     * ✅ 查找第一个可用菜单
     */
    findFirstNavigableMenu(menus = this.menuTree): any | null {
      const flattenMenus = (menuList: any[]): any[] =>
        menuList.flatMap(m => [m, ...(m.children ? flattenMenus(m.children) : [])])
      return flattenMenus(menus).find(m => !!m.action_model && !!m.path) || null
    },

    /**
     * ✅ 通用跳转函数：根据菜单信息导航
     */
    async navigateToMenu(menu_id: number, action_id: number) {
      const flattenMenus = (menus: any[]): any[] =>
        menus.flatMap(m => [m, ...(m.children ? flattenMenus(m.children) : [])])
      const allMenus = flattenMenus(this.menuTree)
      const menu = allMenus.find(m => String(m.menu_id) === String(menu_id))
      if (!menu) {
        console.warn('❌ 找不到指定 menu_id:', menu_id)
        return
      }

      switch (menu.action_model) {
        case 'ir.actions.act_window':
          router.push(
            `/model/${menu.model}?view_type=${menu.view_type || 'form'}&view_id=${menu.view_id || ''}&menu_id=${menu_id}&action_id=${action_id}`
          )
          break
        case 'ir.actions.client':
          router.push(
            `/client/${menu.path.replace(/^\//, '')}?menu_id=${menu_id}&action_id=${action_id}`
          )
          break
        case 'ir.actions.act_url':
          if (menu.path?.startsWith('http')) {
            window.open(menu.path, '_blank')
          } else {
            router.push(menu.path)
          }
          break
        default:
          console.warn('⚠️ 未处理的 action_model:', menu.action_model)
      }
    }
  }
})
