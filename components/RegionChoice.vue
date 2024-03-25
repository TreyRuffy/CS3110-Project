<script setup lang="ts">
const props = defineProps({
  singlePlayer: {
    type: Boolean,
    required: true,
  },
})

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
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=world',
    image: 'images/World.jpg',
    description: 'Countries all over the world.',
  },
]

const continents: CardItem[] = [
  {
    title: 'Africa',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=africa',
    image: 'images/Africa.jpg',
    description: 'Countries specific to Africa.',
  },
  {
    title: 'Americas',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=americas',
    image: 'images/Central America and the Caribbean.jpg',
    description: 'Countries specific to North and South America.',
  },
  {
    title: 'Asia',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=asia',
    image: 'images/Asia.jpg',
    description: 'Countries specific to Asia.',
  },
  {
    title: 'Europe',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=europe',
    image: 'images/Europe.jpg',
    description: 'Countries specific to Europe.',
  },
  {
    title: 'Oceania',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=oceania',
    image: 'images/Oceania.jpg',
    description: 'Countries specific to Oceania.',
  },
]

const countries: CardItem[] = [
  {
    title: 'Canada',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=canada',
    image: 'images/Canada Map.jpg',
    description: 'Provinces of Canada.',
  },
  {
    title: 'Japan',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=japan',
    image: 'images/Japan Map.jpg',
    description: 'Prefectures of Japan.',
  },
  {
    title: 'United States of America',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=usa',
    image: 'images/USA Map.jpg',
    description: 'The 50 states of the USA.',
  },
]
</script>

<template>
  <CardSlider :items="world" title="World" />
  <CardSlider :items="continents" title="Continents" />
  <CardSlider :items="countries" title="Countries" />
</template>

<style scoped></style>
