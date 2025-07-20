<template>
  <div class="p-6">
    <h1 class="text-xl font-bold mb-4">{{ pageTitle }}</h1>

    <template v-if="structure">
      <DynamicForm
        v-if="structure.layout?.tag === 'form'"
        :fields="structure.fields"
        :layout="structure.layout"
        :recordId="recordId"
        :model="model"
      />

      <DynamicTable
        v-else-if="structure.layout?.tag === 'tree'"
        :fields="structure.fields"
        :layout="structure.layout"
        :model="model"
        :records="records"
      />

      <KanbanView
        v-else-if="structure.layout?.tag === 'kanban'"
        :fields="structure.fields"
        :layout="structure.layout"
        :model="model"
        :records="records"
      />

      <p v-else class="text-gray-500">
        不支持的视图类型：{{ structure.layout?.tag }}
      </p>
    </template>

    <p v-else class="text-gray-400">🔄 正在加载页面结构...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiRequest } from '@/api/base'

import DynamicForm from '@/components/DynamicForm.vue'
import DynamicTable from '@/components/DynamicTable.vue'
import KanbanView from '@/components/KanbanView.vue'

const route = useRoute()
const model = route.params.model || route.query.model || null
const viewType = route.query.view_type || 'form'
const viewId = route.query.view_id || null
const recordId = route.query.id || null

const pageTitle = route.meta.title || model || '动态页面'
const structure = ref(null)
const records = ref([])

onMounted(async () => {
  console.log('🚨 model 参数值为：', model)

  if (!model) {
    console.warn('❌ 缺少 model 参数，终止加载')
    return
  }

  try {
    console.log('📤 请求视图结构:', { model, viewType, viewId })
    const structureRes = await apiRequest('/api/model/view_structure', 'POST', {
      model,
      view_type: viewType,
      view_id: viewId,
    })

    structure.value = structureRes.data

    if (['tree', 'kanban'].includes(viewType)) {
      console.log('📤 请求记录数据: ', model)
      const dataRes = await apiRequest('/api/model/records', 'POST', {
        model,
        filters: {},
      })
      records.value = dataRes.data.records || dataRes.data || []
    }
  } catch (error) {
    console.error('❌ 加载视图结构失败:', error)
  }
})
</script>
