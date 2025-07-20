// src/utils/initializeApp.ts
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import { fetchUserMenus } from '@/api/metaApi'
import { buildDynamicRoutesFromMenuTree } from '@/router/dynamicRoutes'
import router from '@/router'

/**
 * 系统初始化：
 * - 判断是否已登录（token）
 * - 拉取菜单
 * - 注册动态路由
 * - 若未登录，跳转登录页
 */
export async function initializeApp(): Promise<void> {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  if (!authStore.token) {
    console.warn('🔒 未登录，跳转登录页')
    router.replace('/login')
    return
  }

  try {
    const res = await fetchUserMenus()
    const menus = res?.data || []

    if (!Array.isArray(menus) || menus.length === 0) {
      console.warn('⚠️ 菜单数据为空或格式错误')
      return
    }

    appStore.menuTree = menus

    const dynamicRoutes = buildDynamicRoutesFromMenuTree(menus)
    dynamicRoutes.forEach(route => {
      router.addRoute(route)
    })

    console.log('✅ 应用初始化完成，菜单与路由加载完毕')
  } catch (err) {
    console.error('❌ 应用初始化失败:', err)
    router.replace('/login')
  }
}
