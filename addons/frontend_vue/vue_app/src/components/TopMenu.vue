// ✅ 新增组件：components/TopMenu.vue
<template>
  <nav class="flex gap-4 border-b pb-2 px-4 bg-white text-sm">
    <div
      v-for="child in authStore.topMenuChildren"
      :key="child.id"
      @click="handleMenuClick(child)"
      :class="[
        'cursor-pointer px-2 py-1 rounded hover:text-blue-600 hover:bg-gray-100',
        child.id === authStore.activeMenuId ? 'text-blue-600 font-semibold' : 'text-gray-700'
      ]"
    >
      {{ child.name }}
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { parseMenuAction } from '@/utils/menuParser'

const authStore = useAuthStore()
const router = useRouter()

function handleMenuClick(menu) {
  authStore.setActiveMenu(menu)
  const parsed = parseMenuAction(menu)
  if (parsed.disabled) return
  if (parsed.external) {
    parsed.target === 'new'
      ? window.open(parsed.url, '_blank')
      : (location.href = parsed.url)
  } else {
    router.push(parsed.path)
  }
}
</script>
