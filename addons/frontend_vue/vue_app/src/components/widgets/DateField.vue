<template>
  <input
    type="date"
    class="border rounded px-2 py-1 w-full"
    :value="formattedValue"
    @input="handleInput"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue)
  return date.toISOString().slice(0, 10)
})

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
input[type="date"] {
  min-height: 2rem;
}
</style>
