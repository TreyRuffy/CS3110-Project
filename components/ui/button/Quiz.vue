<!-- This is the buttons for the quiz -->
<script setup lang="ts">
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <UiButtonRegular class="btn-lg h-full" :disbled="disabled"><slot></slot></UiButtonRegular>
</template>
