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
  <div
    class="m-auto max-w-[95vw] sm:max-h-[60vh] sm:max-w-[85vw] lg:max-h-[70vh] lg:max-w-[80vw] xl:max-w-[70vw]"
  >
    <div class="flex flex-col items-center justify-center">
      <Carousel
        v-if="items.length > 1"
        :wrap-around="items.length > (useViewport().isLessThan('desktop') ? 2 : 3)"
        :items-to-show="cardCount"
        class="btn-block rounded-2xl drop-shadow-2xl"
      >
        <Slide v-for="item in items" :key="item.title" class="rounded-2xl p-2 pb-6 pt-2">
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
      <div>
        <CategoryCard
          v-if="items.length == 1"
          :title="items[0].title"
          :link="items[0].link"
          :image="items[0].image"
          :description="items[0].description"
          :new-badge="items[0].newBadge"
          class="rounded-2xl pt-2"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
