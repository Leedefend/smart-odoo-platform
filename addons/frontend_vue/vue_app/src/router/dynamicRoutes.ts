import { RouteRecordRaw } from 'vue-router'
import { MenuItem } from '@/types'
import ModelPage from '@/views/ModelPage.vue'
import ClientPage from '@/views/ClientPage.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'

export function buildDynamicRoutesFromMenuTree(menuTree: MenuItem[]): RouteRecordRaw[] {
  const children: RouteRecordRaw[] = []

  const walk = (menus: MenuItem[]) => {
    for (const menu of menus) {
      // ✅ 跳过无效菜单
      if ((!menu.path || menu.path === '#') && (!menu.children || menu.children.length === 0)) continue

      // ✅ 深度优先递归子菜单
      if (menu.children && menu.children.length > 0) {
        walk(menu.children)
      }

      // ✅ 无 action_model 不注册（常为分组项）
      if (!menu.action_model) continue

      // ✅ 跳过 Odoo 不支持的 action_model 类型
      if (['ir.actions.act_url'].includes(menu.action_model)) {
        console.warn(`⚠️ 未支持的 action_model: ${menu.action_model}（跳过路径: ${menu.path}）`)
        continue
      }

      // ✅ 清理路径（只保留无参数部分）
      const cleanPath = (menu.path || `menu_${menu.menu_id}`).split('?')[0].replace(/^\//, '')

      // ✅ 选择组件
      let component: any = null
      switch (menu.action_model) {
        case 'ir.actions.act_window':
          component = ModelPage
          break
        case 'ir.actions.client':
          component = ClientPage
          break
        default:
          console.warn(`⚠️ 未支持的 action_model: ${menu.action_model}（跳过路径: ${cleanPath}）`)
          continue
      }

      children.push({
        path: cleanPath,
        name: menu.name || `menu_${menu.menu_id}`,
        component,
        meta: {
          menu_id: menu.menu_id,
          action_id: menu.action_id,
          title: menu.title || menu.name,
          action_model: menu.action_model,
          model: menu.model || null,
          view_type: menu.view_type || 'form',
          view_id: menu.view_id || null,
          position: menu.position || 'aside',
          icon: menu.icon || null,
        }
      })
    }
  }

  walk(menuTree)

  // ✅ 附加通用详情页
  children.push({
    path: 'model/:model',
    name: 'dynamic_model',
    component: ModelPage,
    meta: { position: 'aside' }
  })

  children.push({
    path: 'client/:clientAction',
    name: 'client_action',
    component: ClientPage,
    props: true,
    meta: {
      position: 'aside',
      isClientAction: true
    }
  })

  return [
    {
      path: '/',
      component: LayoutAuthenticated,
      children: [
        { path: '', redirect: children[0]?.path || 'home' },
        ...children
      ]
    }
  ]
}

