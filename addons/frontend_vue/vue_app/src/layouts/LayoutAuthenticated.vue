<template>
  <div class="flex h-screen bg-gray-100">
    <!-- 侧边栏 -->
    <aside class="w-64 bg-white border-r shadow-md">
      <div class="h-16 flex items-center justify-center text-xl font-bold text-blue-600 border-b">
        SmartOdooPlatform
      </div>
      <SidebarMenu />
    </aside>

    <!-- 主体内容 -->
    <div class="flex-1 flex flex-col">
      <!-- 顶部栏：标题 + 用户信息 -->
      <header class="h-16 bg-white shadow flex items-center justify-between px-4">
        <div class="text-lg font-semibold">
          {{ $route.meta.title || '未命名页面' }}
        </div>
        <div class="flex items-center space-x-4 text-sm text-gray-600">
          <span>{{ authStore.user?.name || '未登录' }}</span>
          <button @click="handleLogout" class="text-red-500 hover:underline">
            退出登录
          </button>
        </div>
      </header>

      <!-- ✅ 顶部子菜单栏 -->
      <TopMenu v-if="authStore.topMenuChildren.length > 0" />

      <!-- 页面内容区域 -->
      <main class="flex-1 overflow-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import SidebarMenu from '@/components/SidebarMenu.vue'
import TopMenu from '@/components/TopMenu.vue'
import { findParentMenu } from '@/utils/menuHelper'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  const menuId = Number(route.query.menu_id)
  if (menuId && authStore.menuTree.length > 0) {
    const main = findParentMenu(menuId, authStore.menuTree)
    if (main) authStore.setActiveMenu(main)
  }
})
</script>

<style scoped>
.router-link-active {
  background-color: #3b82f6;
  color: white;
}
</style>
