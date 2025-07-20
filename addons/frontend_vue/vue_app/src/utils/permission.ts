// ✅ 文件：src/utils/permission.ts
export function hasPermission(user: any, permission: string): boolean {
  return user?.permissions?.includes(permission)
}