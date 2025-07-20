// ✅ 文件：components/MenuActions.vue
<template>
  <div v-if="actionMenus.length" class="flex space-x-4 px-6 py-2 bg-white border-b shadow-sm">
    <button
      v-for="action in actionMenus"
      :key="action.id"
      @click="handleActionClick(action)"
      :class="[
        'px-4 py-2 rounded hover:bg-blue-100 text-sm',
        action.id === activeActionId ? 'bg-blue-500 text-white' : 'text-gray-700'
      ]"
    >
      {{ action.name }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { parseMenuAction } from '@/utils/menuParser'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const actionMenus = computed(() => authStore.activeSubMenu?.children || [])
const activeActionId = computed(() => Number(route.query.action_id) || null)

function handleActionClick(menu) {
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

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
