// ✅ 递归查找上层主菜单
export function findParentMenu(menuId: number, tree: any[]): any | null {
  for (const node of tree) {
    if (node.id === menuId) return node
    if (node.children) {
      const found = findParentMenu(menuId, node.children)
      if (found) return node
    }
  }
  return null
}
