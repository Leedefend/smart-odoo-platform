<template>
  <select
    class="border rounded px-2 py-1 w-full"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="">请选择</option>
    <option
      v-for="[key, label] in options"
      :key="key"
      :value="key"
    >
      {{ label }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: [String, Number, Boolean],
  options: Array
})
defineEmits(['update:modelValue'])
</script>
