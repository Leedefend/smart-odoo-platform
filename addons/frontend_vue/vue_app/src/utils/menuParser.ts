// ✅ 动作类型解析器：根据菜单项生成跳转路径或行为
export function parseMenuAction(menu: any) {
  const action = menu.action
  const type = action?.type || null

  if (!action || !action.type) return { disabled: true }

  switch (type) {
    case 'act_window':
      return {
        path: `/model/${action.model}?view_type=${action.view_mode?.split(',')[0]}&view_id=${menu.view_id || ''}&action_id=${action.id}&menu_id=${menu.id}`,
        disabled: false
      }
    case 'url':
      return {
        external: true,
        target: action.target || 'current',
        url: action.url,
        disabled: false
      }
    case 'client':
      return {
        path: `/client/${action.tag}?menu_id=${menu.id}&action_id=${action.id}`,
        disabled: false
      }
    default:
      return { disabled: true }
  }
}
