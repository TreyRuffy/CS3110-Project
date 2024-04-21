<script setup lang="ts">
const toastStore = useToastStore()
const toast = computed(() => toastStore.getToast())
</script>

<template>
  <div v-if="toast" :key="toast.title" class="toast">
    <div
      class="alert"
      :class="[
        toast.type === 'warning'
          ? 'alert-warning'
          : toast.type === 'error'
            ? 'alert-error'
            : toast.type === 'success'
              ? 'alert-success'
              : toast.type === 'info'
                ? 'alert-info'
                : '',
      ]"
    >
      <div>
        <h3 class="font-bold">{{ toast.title }}</h3>
        <div class="text-sm">{{ toast.message }}</div>
      </div>
      <button class="btn btn-circle btn-ghost btn-sm" @click="toastStore.removeToast()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
