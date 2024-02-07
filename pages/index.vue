<script lang="ts">
type CardItem = {
  title: string
  link: string
  image: string
  description: string
  newBadge: boolean
}

const cardItems: CardItem[] = [
  {
    title: 'Title',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Description',
    newBadge: true,
  },
  {
    title: 'Title 2',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Description',
    newBadge: true,
  },
  {
    title: 'Title 3',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Description',
    newBadge: true,
  },
  {
    title: 'Title 4',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Description',
    newBadge: true,
  },
]

export default {
  data() {
    return {
      cardItems,
    }
  },
}
</script>

<template>
  <div>
    <p>Home page</p>
    <CardSlider :items="cardItems" />
  </div>
</template>
