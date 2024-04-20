<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: false,
    default: null,
  },
  openLinkFunction: {
    type: Function,
    default: null,
  },
  badge: {
    type: String,
    default: null,
    required: false,
  },
})

const router = useRouter()

const openLink = () => {
  if (props.openLinkFunction) {
    props.openLinkFunction()
  } else {
    router.push(props.link)
  }
}
</script>

<template>
  <button
    class="min-w-70 card card-compact w-96 cursor-pointer rounded-2xl bg-base-100 shadow-xl"
    @click="openLink()"
  >
    <NuxtImg
      :src="image"
      :alt="alt == null ? title : alt"
      class="rounded-t-2xl"
      :width="800"
      :height="350"
      format="webp"
    />
    <span class="card-body">
      <span class="card-title">
        {{ title }}
        <span v-if="badge" class="badge badge-secondary badge-sm">{{ badge }}</span>
      </span>
      <span v-if="description" class="text-left">{{ description }}</span>
    </span>
  </button>
</template>

<style scoped></style>
