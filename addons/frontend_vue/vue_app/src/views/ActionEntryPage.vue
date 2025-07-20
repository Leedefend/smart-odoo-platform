<template>
  <div class="p-6 text-gray-600">
    <p>正在加载页面，请稍候...</p>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiRequest } from '@/api/base'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

/**
 * ✅ 从 menuTree 中查找完整菜单信息
 */
function findMenuByAction(action_id) {
  const flattenMenus = (menus) =>
    menus.flatMap(menu => [menu, ...(menu.children ? flattenMenus(menu.children) : [])])
  const allMenus = flattenMenus(authStore.menuTree || [])
  return allMenus.find(m => String(m.action_id) === String(action_id)) || null
}

onMounted(async () => {
  const menu_id = route.query.menu_id
  const action_id = route.query.action_id

  if (!action_id) {
    console.warn('❌ 缺少 action_id，终止跳转')
    return
  }

  const matchedMenu = findMenuByAction(action_id)
  const action_model = matchedMenu?.action_model

  if (!action_model) {
    console.error('🚨 无法根据 action_id 找到对应的 action_model，终止跳转')
    return
  }

  try {
    const res = await apiRequest('/api/actions/load', 'POST', {
      action_model,
      action_id,
      menu_id,
    })

    const { type, model, view_mode, view_id, tag, url } = res
    const firstViewType = (view_mode || '').split(',')[0] || 'form'

    console.log('✅ 动作解析结果:', {
      type,
      model,
      view_mode,
      view_id,
      tag,
      url
    })

    switch (type) {
      case 'act_window':
        if (!model) {
          console.warn('❌ act_window 缺少 model，终止跳转')
          return
        }

        const path = `/model/${model}?view_type=${firstViewType}&view_id=${view_id || ''}&menu_id=${menu_id}&action_id=${action_id}`

        if (router.currentRoute.value.fullPath !== path) {
          await nextTick()
          router.replace(path)
        }
        break

      case 'client':
        if (!tag && !matchedMenu?.path) {
          console.warn('❌ client 类型未提供 tag 或路径，终止跳转')
          return
        }

        const clientPath = matchedMenu?.path?.replace(/^\//, '') || `client/${tag}`
        router.replace(`/client/${clientPath}?menu_id=${menu_id}&action_id=${action_id}`)
        break

      case 'url':
        if (url) {
          window.open(url, '_blank')
        } else {
          console.warn('❌ url 类型未提供跳转地址')
        }
        break

      default:
        console.warn('⚠️ 不支持的 action type:', type)
    }
  } catch (error) {
    console.error('❌ 动作跳转出错:', error)
  }
})
</script>
