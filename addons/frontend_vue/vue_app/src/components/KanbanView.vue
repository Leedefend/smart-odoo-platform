<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  fields: Object,
  layout: Object,
  model: String,
  records: {
    type: Array,
    required: true
  }
})

const router = useRouter()

function getFieldValue(record, name) {
  const value = record[name]
  return Array.isArray(value) ? value[1] || value[0] : value
}

function shouldShow(field, record) {
  // 预留复杂判断：如 t-if，可后续扩展
  return true
}

function getColor(index) {
  const colors = [
    '#f87171', '#fbbf24', '#34d399', '#60a5fa',
    '#a78bfa', '#f472b6', '#facc15', '#2dd4bf'
  ]
  return colors[index % colors.length]
}

function getUserInitial(user) {
  const name = Array.isArray(user) ? user[1] : user
  return name ? name[0].toUpperCase() : '?'
}

function toggleFavorite(record) {
  record.is_favorite = !record.is_favorite
  // ❗这里应调用后端API更新收藏状态（待你集成）
}

function openDetail(record) {
  const id = record.id
  router.push(`/model/${props.model}?view_type=form&id=${id}`)
}
</script>

<template>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    <div
      v-for="(record, index) in props.records"
      :key="index"
      class="relative bg-white rounded shadow p-4 border hover:shadow-lg transition cursor-pointer"
      @click="openDetail(record)"
    >
      <!-- ⭐ 收藏 -->
      <div class="absolute top-2 left-2 text-yellow-400 text-lg z-10" @click.stop="toggleFavorite(record)">
        <span v-if="record.is_favorite">★</span>
        <span v-else>☆</span>
      </div>

      <!-- 🎨 颜色圆点 -->
      <div
        v-if="record.color"
        class="absolute bottom-2 left-2 w-3 h-3 rounded-full"
        :style="{ backgroundColor: getColor(record.color) }"
      />

      <!-- 🧑 用户缩写 -->
      <div
        v-if="record.user_id"
        class="absolute bottom-2 right-2 bg-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
      >
        {{ getUserInitial(record.user_id) }}
      </div>

      <!-- ✅ 标题 -->
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        {{ getFieldValue(record, 'name') || getFieldValue(record, 'display_name') || '未命名' }}
      </h3>

      <!-- ✅ 字段列表 -->
      <ul class="text-xs text-gray-600 space-y-1">
        <li
          v-for="(field, i) in props.layout.cards"
          :key="i"
          v-if="shouldShow(field, record)"
        >
          <strong>{{ props.fields[field.name]?.string || field.name }}:</strong>
          {{ getFieldValue(record, field.name) }}
        </li>
      </ul>
    </div>
  </div>
</template>
