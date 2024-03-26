<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
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
  internalFetch: {
    type: Boolean,
    default: false,
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
  } else if (props.internalFetch) {
    $fetch(props.link)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
      })
  } else {
    router.push(props.link)
  }
}
</script>

<template>
  <a
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
    <div class="card-body">
      <div class="card-title">
        {{ title }}
        <div v-if="badge" class="badge badge-secondary badge-sm">{{ badge }}</div>
      </div>
      <p v-if="description" class="text-left">{{ description }}</p>
    </div>
  </a>
</template>

<style scoped></style>
