<!-- This is the button at the bottom of the screen for smaller devices -->
<script setup lang="ts">
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    class="text-md btn font-[400] shadow-md md:text-xl"
    :class="[disabled ? 'btn-disabled' : '']"
  >
    <slot></slot>
  </button>
</template>
