<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-gray-700">{{ field.string }}</h3>
      <button
        v-if="!readonly"
        @click="addRow"
        class="text-sm bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
      >添加</button>
    </div>

    <table class="w-full table-auto border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="(f, key) in subFields"
            :key="key"
            class="text-left px-2 py-1 border-b"
          >{{ f.string || key }}</th>
          <th v-if="!readonly" class="px-2 py-1">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, idx) in localRecords"
          :key="idx"
          class="border-t"
        >
          <td v-for="(f, key) in subFields" :key="key" class="px-2 py-1">
            <input
              v-if="!readonly"
              v-model="localRecords[idx][key]"
              class="w-full border rounded px-1 py-0.5 text-sm"
            />
            <span v-else>{{ record[key] }}</span>
          </td>
          <td v-if="!readonly" class="text-center text-sm text-red-600">
            <button @click="removeRow(idx)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  field: any
  records: any[]
  readonly: boolean
}>()

const emit = defineEmits(['update:records'])
const localRecords = ref([...props.records])

const subFields = computed(() => props.field.subfields || {})

watch(
  () => localRecords.value,
  (val) => emit('update:records', val),
  { deep: true }
)

function addRow() {
  localRecords.value.push({})
}

function removeRow(index: number) {
  localRecords.value.splice(index, 1)
}
</script>

<style scoped>
th, td {
  border: 1px solid #d1d5db;
}
</style>
