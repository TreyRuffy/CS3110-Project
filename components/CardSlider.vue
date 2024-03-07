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
  title: {
    type: String,
    required: false,
    default: null,
  },
})

const cardCount = ref(3)
const updateCardCount = () => {
  cardCount.value = useViewport().isLessThan('desktop')
    ? useViewport().isLessThan('tablet')
      ? 1
      : 2
    : 3
}

watch(useViewport().breakpoint, () => {
  updateCardCount()
})

updateCardCount()
</script>

<template>
  <div class="flex flex-col items-center justify-center justify-items-center">
    <h1
      v-if="title"
      class="m-auto w-full max-w-[95vw] pl-2 font-bold sm:max-h-[60vh] sm:max-w-[85vw] lg:max-h-[70vh] lg:max-w-[80vw] xl:max-w-[70vw]"
      :class="cardCount < 2 ? 'text-center' : 'pl-2'"
    >
      {{ title }}
    </h1>
    <div class="w-full max-w-full">
      <swiper-container
        v-if="items.length > 0"
        :slides-per-view="cardCount"
        class="drop-shadow-l m-auto mb-4 flex w-full max-w-[95vw] items-center overflow-hidden rounded-2xl sm:max-h-[60vh] sm:max-w-[85vw] lg:max-h-[70vh] lg:max-w-[80vw] xl:max-w-[70vw]"
        :class="{ 'cursor-grab': items.length > cardCount }"
        :navigation="true"
        :pagination="true"
        :pagination-dynamic-bullets="true"
      >
        <swiper-slide
          v-for="item in items"
          :key="item.title"
          class="flex w-96 items-center justify-center rounded-2xl p-2 pb-8 pt-4"
        >
          <CategoryCard
            :title="item.title"
            :link="item.link"
            :image="item.image"
            :description="item.description"
            :new-badge="item.newBadge"
          />
        </swiper-slide>
      </swiper-container>
    </div>
  </div>
</template>

<style scoped></style>
