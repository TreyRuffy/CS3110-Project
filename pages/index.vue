<script lang="ts">
type CardItem = {
  title: string
  link: string
  image: string
  description: string
  newBadge: boolean
}
const world: CardItem[] = [
  {
    title: 'World',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries all over the world.',
    newBadge: true,
  },
]

const continents: CardItem[] = [
  {
    title: 'Africa',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Africa.',
    newBadge: true,
  },
  {
    title: 'Americas',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to North and South America.',
    newBadge: true,
  },
  {
    title: 'Asia',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Asia.',
    newBadge: true,
  },
  {
    title: 'Europe',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Europe.',
    newBadge: true,
  },
  {
    title: 'Oceania',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Oceania.',
    newBadge: true,
  },
]

const countries: CardItem[] = [
  {
    title: 'Canada',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Provinces of Canada.',
    newBadge: true,
  },
  {
    title: 'Japan',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Prefectures of Japan.',
    newBadge: true,
  },
  {
    title: 'United States of America',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'The 50 states of the USA.',
    newBadge: true,
  },
]

export default {
  data() {
    return {
      world,
      continents,
      countries,
    }
  },
}
</script>

<template>
  <div>
    <p>Home page</p>
    <CardSlider :items="world" />
    <CardSlider :items="continents" />
    <CardSlider :items="countries" />
    <div>
      <h1>Color mode: {{ $colorMode.value }}</h1>
      <select v-model="$colorMode.preference">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="sepia">Sepia</option>
      </select>
    </div>
  </div>
</template>
