import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import LoginView from '@/views/LoginView.vue'
import HomePage from '@/views/HomePage.vue'
import ModelPage from '@/views/ModelPage.vue'

// ✅ 静态 Layout 子路由（首页和通用模型页）
const layoutChildren: RouteRecordRaw[] = [
  { path: '', redirect: '/home' },
  { path: 'home', component: HomePage },
  { path: 'model/:model', name: 'DynamicModel', component: ModelPage } // 备用方式（仍保留）
]

// ✅ 顶层静态路由
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/',
    component: LayoutAuthenticated,
    children: layoutChildren
  }
]

// ✅ 创建 Router 实例
const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

/**
 * ✅ 注入 Odoo 菜单结构为动态路由
 */
export function injectMenuRoutes(menuTree = []) {
  const flattenMenus = (menus) =>
    menus.flatMap(menu => [menu, ...(menu.children ? flattenMenus(menu.children) : [])])

  const layoutRoute = router.getRoutes().find(r => r.path === '/')

  flattenMenus(menuTree).forEach(menu => {
    // 🚫 忽略无效菜单（必须有路径、模型和动作）
    if (!menu.path || !menu.model || !menu.action_id) return

    const routePath = menu.path.replace(/^\//, '') // 去除前导 /
    const routeName = menu.name || `menu_${menu.menu_id}`

    // ✅ 构建路由配置
    const routeConfig: RouteRecordRaw = {
      path: routePath,
      name: routeName,
      component: ModelPage,
      meta: {
        menu_id: menu.menu_id,
        action_id: menu.action_id,
        action_model: menu.action_model,
        model: menu.model,
        view_type: menu.view_type || 'form',
        view_id: menu.view_id || null,
        title: menu.title || menu.name,
        position: menu.position || 'aside'
      }
    }

    // ✅ 添加为 Layout 的子路由
    router.addRoute('/', routeConfig)
  })
}

// ✅ 登录路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/login']
  const isPublic = publicPages.includes(to.path)

  if (!isPublic && !authStore.isLoggedIn) {
    return next('/login')
  }

  next()
})

export default router
