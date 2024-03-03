<script setup lang="ts">
interface CardItem {
  title: string
  link: string
  image: string
  description: string
  newBadge?: boolean
}

defineProps({
  items: {
    type: Array as PropType<CardItem[]>,
    required: true,
  },
})

const cardCount = ref(
  useViewport().isLessThan('desktop') ? (useViewport().isLessThan('tablet') ? 1 : 2) : 3,
)
const updateCardCount = () => {
  cardCount.value = useViewport().isLessThan('desktop')
    ? useViewport().isLessThan('tablet')
      ? 1
      : 2
    : 3
}

onMounted(() => {
  window.addEventListener('resize', updateCardCount)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateCardCount)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <Carousel
      v-if="items.length > 0"
      :wrap-around="items.length > (useViewport().isLessThan('desktop') ? 2 : 3)"
      :items-to-show="cardCount"
      class="btn-block m-auto max-w-[95vw] rounded-2xl drop-shadow-2xl sm:max-h-[60vh] sm:max-w-[85vw] lg:max-h-[70vh] lg:max-w-[80vw] xl:max-w-[70vw]"
    >
      <Slide v-for="item in items" :key="item.title" class="rounded-2xl p-2 pb-6 pt-4">
        <CategoryCard
          :title="item.title"
          :link="item.link"
          :image="item.image"
          :description="item.description"
          :new-badge="item.newBadge"
        />
      </Slide>
      <template #addons="{ slidesCount }">
        <Navigation v-if="slidesCount > 1" />
        <Pagination v-if="slidesCount > 1" />
      </template>
    </Carousel>
  </div>
</template>

<style scoped></style>
