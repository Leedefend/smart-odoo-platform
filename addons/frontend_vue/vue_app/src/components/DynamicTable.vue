<template>
  <div>
    <div class="text-lg font-semibold mb-4">{{ title }}</div>
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th v-for="field in visibleFields" :key="field.name" class="py-2 px-4 border-b text-left">
            {{ field.string || field.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in records" :key="record.id">
          <td v-for="field in visibleFields" :key="field.name" class="py-2 px-4 border-b">
            {{ formatValue(record[field.name], field) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiRequest } from '@/api/base'

const props = defineProps({
  model: String,
  viewId: Number,
  viewType: String,
})

const title = ref('数据列表')
const fields = ref([])
const records = ref([])

const visibleFields = computed(() =>
  fields.value.filter(field => !field.invisible && field.store)
)

onMounted(async () => {
  const viewRes = await apiRequest('/api/model/view_structure', 'POST', {
    model: props.model,
    view_type: props.viewType || 'tree',
    view_id: props.viewId
  })
  fields.value = Object.values(viewRes.fields || {})
  title.value = viewRes.titleField || props.model

  const dataRes = await apiRequest('/api/model/record', 'POST', {
    model: props.model,
    view_type: 'tree'
  })
  records.value = dataRes.records || []
})

function formatValue(val, field) {
  if (field.type === 'many2one') {
    return val?.[1] || '-'
  } else if (field.type === 'selection') {
    const option = field.selection?.find(([k]) => k === val)
    return option?.[1] || val
  } else if (typeof val === 'boolean') {
    return val ? '是' : '否'
  }
  return val ?? '-'
}
</script>

<style scoped>
th {
  background-color: #f9fafb;
  font-weight: 600;
}
</style>
