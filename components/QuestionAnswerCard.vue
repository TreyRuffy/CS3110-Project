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
    <div>
      <h2 class="m-6 text-center text-xl">{{ numAnswers }}</h2>
    </div>
    <div class="my-2 h-auto justify-center bg-black"></div>
    <p class="col-span-2 m-6 justify-center text-center text-xl">{{ countryChoice }}</p>
  </div>
</template>

<style scoped>
.custom-grid {
  grid-template-columns: 1fr 0.5px 1fr 1fr;
}
</style>
