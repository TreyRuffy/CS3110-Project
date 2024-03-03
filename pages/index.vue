<script setup lang="ts">
interface CardItem {
  title: string
  link: string
  image: string
  description: string
  newBadge?: boolean
}

const world: CardItem[] = [
  {
    title: 'World',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries all over the world.',
  },
]

const continents: CardItem[] = [
  {
    title: 'Africa',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Africa.',
  },
  {
    title: 'Americas',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to North and South America.',
  },
  {
    title: 'Asia',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Asia.',
  },
  {
    title: 'Europe',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Europe.',
  },
  {
    title: 'Oceania',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Countries specific to Oceania.',
  },
]

const countries: CardItem[] = [
  {
    title: 'Canada',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Provinces of Canada.',
  },
  {
    title: 'Japan',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'Prefectures of Japan.',
  },
  {
    title: 'United States of America',
    link: '/',
    image: 'https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg',
    description: 'The 50 states of the USA.',
  },
]
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
