<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div v-for="(fieldNode, index) in formFields" :key="index">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ fields[fieldNode.attrs.name]?.string || fieldNode.attrs.name }}
      </label>
      <component
        :is="resolveComponent(fieldNode)"
        v-model="formData[fieldNode.attrs.name]"
        :field="fields[fieldNode.attrs.name]"
        :readonly="readonly"
        class="w-full border rounded px-2 py-1"
        @update:modelValue="handleFieldChange(fieldNode.attrs.name)"
      />
    </div>

    <button
      v-if="!readonly"
      type="submit"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      保存
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import TextField from './widgets/TextField.vue'
import BooleanField from './widgets/BooleanField.vue'
import SelectField from './widgets/SelectField.vue'
import DateField from './widgets/DateField.vue'
import { apiRequest } from '@/api/base'

const props = defineProps<{
  fields: Record<string, any>
  viewStructure: any
  record: Record<string, any>
  readonly: boolean
}>()

const formData = ref<Record<string, any>>({})

onMounted(() => {
  formData.value = { ...props.record }
})

const formFields = computed(() =>
  props.viewStructure?.children?.filter((n: any) => n.tag === 'field') || []
)

function resolveComponent(node: any) {
  const field = props.fields[node.attrs.name]
  if (!field) return TextField
  if (field.type === 'boolean') return BooleanField
  if (field.type === 'selection') return SelectField
  if (field.type === 'date' || field.type === 'datetime') return DateField
  return TextField
}

function handleFieldChange(name: string) {
  console.log(`字段联动触发：${name} =`, formData.value[name])
}

async function handleSubmit() {
  try {
    const res = await apiRequest('/api/model/save', 'POST', {
      model: props.viewStructure?.meta?.model,
      values: formData.value,
    })

    if (res.status === 'success') {
      alert('保存成功 ✅')
    } else {
      alert('保存失败 ❌')
    }
  } catch (err) {
    console.error('保存错误', err)
  }
}
</script>

<style scoped>
/* 可按需添加自定义样式 */
</style>
