<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">
      🧩 自定义客户端页面
    </h1>

    <div class="bg-white shadow-md rounded p-4 space-y-2 border border-gray-200">
      <p><strong>菜单名称：</strong> {{ meta.title }}</p>
      <p><strong>Action Model：</strong> {{ meta.action_model }}</p>
      <p><strong>Action ID：</strong> {{ meta.action_id }}</p>
      <p><strong>模型：</strong> {{ meta.model }}</p>
      <p><strong>视图类型：</strong> {{ meta.view_type }}</p>
      <p><strong>菜单 ID：</strong> {{ meta.menu_id }}</p>
    </div>

    <div class="mt-6">
      <p class="text-gray-500">你可以在此处加载自定义仪表盘、图表、图像地图、流程图等高级组件。</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const meta = route.meta || {}
</script>
