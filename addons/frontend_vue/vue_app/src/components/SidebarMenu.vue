// ✅ 文件：components/SidebarMenu.vue
<template>
  <nav class="p-4 space-y-2 overflow-auto">
    <div
      v-for="item in menuTree"
      :key="item.id"
      class="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 cursor-pointer"
      :class="{ 'bg-blue-500 text-white': item.id === activeId }"
      @click="handleMenuClick(item)"
    >
      {{ item.name }}
    </div>
  </nav>
</template>

<script setup>
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { parseMenuAction } from '@/utils/menuParser'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const appStore = useAppStore()
const authStore = useAuthStore()
const router = useRouter()

const menuTree = computed(() => appStore.menuTree || [])
const activeId = computed(() => authStore.activeMainMenu?.id || null)

function handleMenuClick(menu) {
  authStore.setActiveMenu(menu)

  // 默认跳转第一个子菜单项（如果有）
  const firstChild = (menu.children || [])[0]
  if (firstChild) {
    const parsed = parseMenuAction(firstChild)
    if (parsed.disabled) return
    if (parsed.external) {
      parsed.target === 'new'
        ? window.open(parsed.url, '_blank')
        : (location.href = parsed.url)
    } else {
      router.push(parsed.path)
    }
  }
}
</script>

<style scoped>
.router-link-active {
  background-color: #3b82f6;
  color: white;
}
</style>
