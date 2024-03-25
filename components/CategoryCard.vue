<script setup lang="ts">
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: false,
    default: null,
  },
  svg: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  link: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    default: null,
    required: false,
  },
})

function sendFetch() {
  $fetch(props.link)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<template>
  <div>
    <NuxtLink
      v-if="!link.includes('api')"
      :href="link"
      class="min-w-70 card card-compact w-96 rounded-2xl bg-base-100 shadow-xl"
    >
      <NuxtImg
        :src="image"
        :alt="alt == null ? title : alt"
        class="rounded-t-2xl"
        :width="800"
        :height="350"
        format="webp"
      />
      <div class="card-body">
        <div class="card-title">
          {{ title }}
          <div v-if="badge" class="badge badge-secondary badge-sm">{{ badge }}</div>
        </div>
        <p v-if="description" class="text-left">{{ description }}</p>
      </div>
    </NuxtLink>
    <div
      v-else
      class="min-w-70 card card-compact w-96 rounded-2xl bg-base-100 shadow-xl"
      @click="sendFetch()"
    >
      <NuxtImg
        :src="image"
        :alt="alt == null ? title : alt"
        class="rounded-t-2xl"
        :width="800"
        :height="350"
        format="webp"
      />
      <div class="card-body">
        <div class="card-title">
          {{ title }}
          <div v-if="badge" class="badge badge-secondary badge-sm">{{ badge }}</div>
        </div>
        <p v-if="description" class="text-left">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
