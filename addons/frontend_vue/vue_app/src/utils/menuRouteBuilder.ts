// src/router/buildMenuRoutes.ts
import type { RouteRecordRaw } from 'vue-router'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'

const ActionEntryPage = () => import('@/views/ActionEntryPage.vue')
const ClientPage = () => import('@/views/ClientPage.vue')

export function buildMenuRoutes(menus: any[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  for (const menu of menus) {
    const {
      path,
      name,
      action_model,
      action_id,
      model,
      view_type = 'form',
      view_id,
      menu_id,
      icon,
      position = 'aside',
      children = []
    } = menu

    // 无 path 且无子节点跳过
    if (!path && children.length === 0) continue

    // 标准化路径（无 path 则构造一个）
    const finalPath = path?.split('?')[0] || `/menu_${menu_id}`

    // 不构建 URL 路由，但可作为跳转入口保留 meta（前端会通过 router.replace 处理）
    if (action_model === 'ir.actions.act_url') {
      continue
    }

    const baseRoute: RouteRecordRaw = {
      path: finalPath.startsWith('/') ? finalPath : `/${finalPath}`,
      component: LayoutAuthenticated,
      meta: {
        title: name,
        model,
        action_model,
        action_id,
        view_id,
        view_type,
        menu_id,
        icon,
        position
      },
      children: []
    }

    if (action_model === 'ir.actions.act_window' && model) {
      baseRoute.children!.push({
        path: '',
        name: `act_window_${model}_${menu_id}`,
        component: ActionEntryPage,
        meta: { ...baseRoute.meta }
      })
    } else if (action_model === 'ir.actions.client') {
      baseRoute.children!.push({
        path: '',
        name: `client_${menu_id}`,
        component: ClientPage,
        meta: { ...baseRoute.meta }
      })
    }

    // 添加当前菜单路由
    routes.push(baseRoute)

    // 递归处理子菜单
    if (children.length > 0) {
      const childRoutes = buildMenuRoutes(children)
      routes.push(...childRoutes)
    }
  }

  return routes
}
