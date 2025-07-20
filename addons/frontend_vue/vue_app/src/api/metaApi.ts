// src/api/metaApi.ts
import { apiRequest } from './base'

export async function fetchModelViewStructure(model: string, viewType = 'form') {
  return apiRequest(`/api/view_structure?model=${model}&view_type=${viewType}`, 'GET')
}

export async function fetchModelRecord(model: string, id: number) {
  return apiRequest(`/api/model/record`, 'POST', { model, id })
}
export async function fetchModelRecords(model: string, filters: any) {
    return apiRequest(`/api/model/records`, 'POST', { model, filters })
    
}
// ✅ 拉取当前用户可访问的菜单列表
export async function fetchUserMenus() {
  return apiRequest('/api/user/menus', 'GET')
}
