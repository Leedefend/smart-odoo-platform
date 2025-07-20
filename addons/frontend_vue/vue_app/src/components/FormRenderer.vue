// ✅ 文件：components/FormRenderer.vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <template v-for="(node, index) in viewNodes" :key="index">
      <!-- 📌 子表嵌套支持 -->
      <component
        v-if="node.tag === 'field' && fields[node.attrs.name]?.type === 'one2many'"
        :is="resolveSubtableComponent(node)"
        :records="formData[node.attrs.name]"
        :field="fields[node.attrs.name]"
        :readonly="readonly"
        @update:records="formData[node.attrs.name] = $event"
      />

      <!-- 📌 普通字段或容器结构 -->
      <component
        v-else-if="node.tag !== 'field'"
        :is="resolveContainer(node)"
        :node="node"
        :fields="fields"
        v-model:form-data="formData"
        :readonly="readonly"
        @field-change="handleFieldChange"
      />

      <!-- 📌 普通字段渲染 -->
      <div v-else-if="!isInvisible(node)">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ fields[node.attrs.name]?.string || node.attrs.name }}
        </label>
        <component
          :is="resolveComponent(node)"
          v-model="formData[node.attrs.name]"
          :field="fields[node.attrs.name]"
          :readonly="isReadonly(node) || readonly"
          :required="isRequired(node)"
          :domain="getDomain(node)"
          class="w-full border rounded px-2 py-1"
          @update:modelValue="handleFieldChange(node.attrs.name)"
        />
      </div>
    </template>

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
import { ref, onMounted, computed, watch } from 'vue'
import TextField from './widgets/TextField.vue'
import BooleanField from './widgets/BooleanField.vue'
import SelectField from './widgets/SelectField.vue'
import DateField from './widgets/DateField.vue'
import GroupWrapper from './layout/GroupWrapper.vue'
import NotebookWrapper from './layout/NotebookWrapper.vue'
import SubtableField from './widgets/SubtableField.vue' // ✅ 新增子表渲染器
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

const viewNodes = computed(() => props.viewStructure?.children || [])

function resolveComponent(node: any) {
  const field = props.fields[node.attrs.name]
  if (!field) return TextField
  if (field.type === 'boolean') return BooleanField
  if (field.type === 'selection') return SelectField
  if (field.type === 'date' || field.type === 'datetime') return DateField
  return TextField
}

function resolveSubtableComponent(node: any) {
  return SubtableField
}

function resolveContainer(node: any) {
  if (node.tag === 'group') return GroupWrapper
  if (node.tag === 'notebook') return NotebookWrapper
  return 'div'
}

function handleFieldChange(name: string, value?: any) {
  console.log(`字段联动触发：${name} =`, formData.value[name])
}

function isInvisible(node: any): boolean {
  return evaluateModifier(node, 'invisible') === true
}

function isReadonly(node: any): boolean {
  return evaluateModifier(node, 'readonly') === true
}

function isRequired(node: any): boolean {
  return evaluateModifier(node, 'required') === true
}

function evaluateModifier(node: any, key: string): boolean {
  if (!node.attrs || !node.attrs.modifiers) return false
  try {
    const modifiers = JSON.parse(node.attrs.modifiers)
    if (modifiers[key]) {
      const condition = modifiers[key]
      return evaluateCondition(condition)
    }
  } catch (e) {
    console.warn(`${key} 修饰符解析失败`, e)
  }
  return false
}

function evaluateCondition(cond: any): boolean {
  if (Array.isArray(cond[0])) {
    return cond.every(c => evaluateCondition(c))
  }
  if (cond[0] === '|') {
    return evaluateCondition(cond[1]) || evaluateCondition(cond[2])
  }
  if (cond[0] === '&') {
    return evaluateCondition(cond[1]) && evaluateCondition(cond[2])
  }
  const [field, op, val] = cond
  if (op === '=') return formData.value[field] === val
  if (op === '!=') return formData.value[field] !== val
  if (op === 'in') return Array.isArray(val) && val.includes(formData.value[field])
  if (op === 'not in') return Array.isArray(val) && !val.includes(formData.value[field])
  return false
}

function getDomain(node: any): any[] {
  if (!node.attrs?.domain) return []
  try {
    const domainExpr = JSON.parse(node.attrs.domain)
    return domainExpr.map((d: any[]) => {
      if (typeof d[0] === 'string') {
        const [field, op, val] = d
        return [field, op, typeof val === 'string' && val.startsWith('formData.') ? formData.value[val.split('.')[1]] : val]
      }
      return d
    })
  } catch (e) {
    console.warn('domain 解析失败', e)
    return []
  }
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
