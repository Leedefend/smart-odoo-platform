<!-- src/views/LoginView.vue -->
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
      <h2 class="text-2xl font-bold text-center">登录 SmartOdooPlatform</h2>

      <input v-model="username" type="text" placeholder="用户名" class="w-full p-2 border rounded" required />
      <input v-model="password" type="password" placeholder="密码" class="w-full p-2 border rounded" required />

      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        登录
      </button>

      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'


const username = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  const success = await authStore.login(username.value, password.value)
  if (!success) {
    error.value = '登录失败，请检查用户名或密码'
  } else {
    router.push('/home')
  }
}

</script>
