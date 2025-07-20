// ✅ 文件：src/api/base.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost'

// ✅ 自动获取 Token 并统一处理错误
export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  config?: any
): Promise<any> {
  const authStore = useAuthStore()
  const url = `${BASE_URL}/${endpoint.replace(/^\/+/, '')}`

  const headers: any = {
    ...(config?.headers || {})
  }

  // ✅ 只有不是登录请求才添加 Authorization
  if (!endpoint.includes('/auth/login') && authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  try {
    const response = await axios({
      url,
      method,
      data,
      ...config,
      headers,
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      console.error(`❌ 请求失败: ${response.data.message}`)
      return Promise.reject(response.data)
    }
  } catch (error: any) {
    console.error('❌ 请求异常:', error)
    return Promise.reject({
      status: 'error',
      message: error?.response?.data?.message || '网络请求异常',
      detail: error
    })
  }
}
