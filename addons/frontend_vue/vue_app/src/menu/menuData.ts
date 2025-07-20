export const allMenus = [
  {
    title: '首页',
    path: '/home',
    component: () => import('@/views/HomePage.vue'),
    roles: ['admin', 'user']
  },
  {
    title: '模型测试',
    path: '/model/project.project',
    component: () => import('@/views/ModelPage.vue'),
    roles: ['admin']
  },
  {
    title: '配置页面',
    path: '/settings',
    component: () => import('@/views/SettingsPage.vue'),
    roles: ['admin']
  }
]
