<!-- This is the buttons just for the index page, they are special but they are beautiful -->
<script setup lang="ts">
defineProps({
  to: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="btn btn-primary btn-md w-[90vw] text-[17px] font-medium shadow-sm md:btn-lg sm:mx-auto sm:max-w-md"
  >
    <slot></slot>
  </NuxtLink>
</template>
