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

      <p v-else class="text-gray-500">不支持的视图类型：{{ structure.layout?.tag }}</p>
    </template>

    <p v-else class="text-gray-400">🔄 正在加载页面结构...</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiRequest } from '@/api/base'

import DynamicForm from '@/components/DynamicForm.vue'
import DynamicTable from '@/components/DynamicTable.vue'
import KanbanView from '@/components/KanbanView.vue'

const route = useRoute()

// ✅ 支持 meta、query 和 params 的兜底取值
const model = computed(() =>
  route.meta.model || route.params.model || route.query.model || null
)
const viewType = computed(() =>
  route.meta.view_type || route.query.view_type || 'form'
)
const viewId = computed(() =>
  route.meta.view_id || route.query.view_id || null
)
const recordId = computed(() =>
  route.query.id || null
)
const pageTitle = computed(() =>
  route.meta.title || model.value || '动态页面'
)

// ✅ 页面数据
const structure = ref(null)
const records = ref([])

async function loadViewStructure() {
  if (!model.value) {
    console.warn('❌ 缺少 model 参数，终止加载')
    return
  }

  structure.value = null
  records.value = []

  try {
    console.log('📤 请求视图结构:', {
      model: model.value,
      view_type: viewType.value,
      view_id: viewId.value
    })

    const structureRes = await apiRequest('/api/model/view_structure', 'POST', {
      model: model.value,
      view_type: viewType.value,
      view_id: viewId.value
    })

    structure.value = structureRes

    if (['tree', 'kanban'].includes(viewType.value)) {
      const dataRes = await apiRequest('/api/model/records', 'POST', {
        model: model.value,
        filters: {}
      })
      records.value = dataRes
    }
  } catch (error) {
    console.error('❌ 加载视图结构失败:', error)
  }
}

onMounted(loadViewStructure)
watch(() => route.fullPath, loadViewStructure)
</script>
