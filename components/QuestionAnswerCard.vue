<script setup lang="ts">
defineProps({
  numAnswers: {
    type: Number,
    required: true,
  },
  countryChoice: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="custom-grid grid">
    <div class="grid items-center">
      <UiHeadingFour class="m-6 text-center">{{ numAnswers }}</UiHeadingFour>
    </div>
    <div class="my-2 h-auto justify-center bg-black"></div>
    <UiHeadingFour class="col-span-2 m-6 justify-center text-center">
      {{ countryChoice }}
    </UiHeadingFour>
  </div>
</template>

<style scoped>
.custom-grid {
  grid-template-columns: 1fr 0.5px 1fr 1fr;
}
</style>
