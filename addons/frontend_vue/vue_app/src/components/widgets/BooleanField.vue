<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', $event.target.checked)"
  />
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
