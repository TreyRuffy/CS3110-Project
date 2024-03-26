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
  description: string
  image: string
  alt?: string
  internalFetch?: boolean
  openLinkFunction?: () => void
  badge?: string
}

const world: CardItem[] = [
  {
    title: 'World',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=world',
    image: 'images/World.jpg',
    description: 'Countries all over the world.',
    internalFetch: !props.singlePlayer,
  },
]

const continents: CardItem[] = [
  {
    title: 'Africa',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=africa',
    image: 'images/Africa.jpg',
    description: 'Countries specific to Africa.',
    internalFetch: !props.singlePlayer,
  },
  {
    title: 'Americas',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=americas',
    image: 'images/Central America and the Caribbean.jpg',
    description: 'Countries specific to North and South America.',
    internalFetch: !props.singlePlayer,
  },
  {
    title: 'Asia',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=asia',
    image: 'images/Asia.jpg',
    description: 'Countries specific to Asia.',
    internalFetch: !props.singlePlayer,
  },
  {
    title: 'Europe',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=europe',
    image: 'images/Europe.jpg',
    description: 'Countries specific to Europe.',
    internalFetch: !props.singlePlayer,
  },
  {
    title: 'Oceania',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=oceania',
    image: 'images/Oceania.jpg',
    description: 'Countries specific to Oceania.',
    internalFetch: !props.singlePlayer,
  },
]

const countries: CardItem[] = [
  {
    title: 'Canada',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=canada',
    image: 'images/Canada Map.jpg',
    description: 'Provinces of Canada.',
    internalFetch: !props.singlePlayer,
  },
  {
    title: 'Japan',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=japan',
    image: 'images/Japan Map.jpg',
    description: 'Prefectures of Japan.',
    internalFetch: !props.singlePlayer,
  },
  {
    title: 'United States of America',
    link: props.singlePlayer ? '/' : '/api/create-server-room?region=usa',
    image: 'images/USA Map.jpg',
    description: 'The 50 states of the USA.',
    internalFetch: !props.singlePlayer,
  },
]
</script>

<template>
  <CardSlider :items="world" title="World" />
  <CardSlider :items="continents" title="Continents" />
  <CardSlider :items="countries" title="Countries" />
</template>

<style scoped></style>
