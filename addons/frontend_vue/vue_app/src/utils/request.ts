// ✅ 文件：src/utils/request.ts
export async function apiRequest(endpoint: string, method: string = 'GET', data: any = null) {
  const base = '/api/'
  const url = base + endpoint
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data)
  }
  const res = await fetch(url, options)
  return res.json()
}