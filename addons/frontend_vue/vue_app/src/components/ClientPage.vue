// ✅ ClientPage.vue
<template>
  <div class="p-6 text-gray-600 text-sm">
    <p>正在加载页面...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiRequest } from '@/api/base'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const actionId = route.query.action_id
  const menuId = route.query.menu_id

  if (!actionId) {
    console.warn('❌ 缺少 action_id 参数')
    return
  }

  const res = await apiRequest('/api/actions/load', 'POST', {
    action_id: actionId,
    menu_id: menuId
  })

  if (res?.type === 'act_window') {
    const { model, view_type, view_id } = res
    const targetPath = `/model?model=${model}&view_type=${view_type}&view_id=${view_id || ''}&menu_id=${menu_id}&action_id=${action_id}`
    router.replace(target)
  } else if (res?.type === 'url') {
    window.open(res.url, '_blank')
  } else if (res?.type === 'client') {
    router.replace(res.tag || '/')
  } else {
    console.warn('❌ 不支持的动作类型:', res)
  }
})
</script>