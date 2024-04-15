<script setup lang="ts">
const props = defineProps({
  singlePlayer: {
    type: Boolean,
    required: true,
  },
})

interface CardItem {
  title: string
  link?: string
  description: string
  image: string
  alt?: string
  openLinkFunction?: () => void
  badge?: string
}

const router = useRouter()

const generateQuestion = (category: string, region: string) => {
  if (props.singlePlayer) {
    router.push(`/question?category=${category}&region=${region}`)
  } else {
    router.push(`/api/create-server-room?category=${category}&region=${region}`)
  }
}

const world: CardItem[] = [
  {
    title: 'World',
    openLinkFunction() {
      generateQuestion('countries', 'world')
    },
    image: 'images/World.jpg',
    description: 'Countries all over the world.',
  },
]

const continents: CardItem[] = [
  {
    title: 'Africa',
    openLinkFunction() {
      generateQuestion('countries', 'africa')
    },
    image: 'images/Africa.jpg',
    description: 'Countries specific to Africa.',
  },
  {
    title: 'Americas',
    openLinkFunction() {
      generateQuestion('countries', 'americas')
    },
    image: 'images/Central America and the Caribbean.jpg',
    description: 'Countries specific to North and South America.',
  },
  {
    title: 'Asia',
    openLinkFunction() {
      generateQuestion('countries', 'asia')
    },
    image: 'images/Asia.jpg',
    description: 'Countries specific to Asia.',
  },
  {
    title: 'Europe',
    openLinkFunction() {
      generateQuestion('countries', 'europe')
    },
    image: 'images/Europe.jpg',
    description: 'Countries specific to Europe.',
  },
  {
    title: 'Oceania',
    openLinkFunction() {
      generateQuestion('countries', 'oceania')
    },
    image: 'images/Oceania.jpg',
    description: 'Countries specific to Oceania.',
  },
]

const countries: CardItem[] = [
  {
    title: 'Canada',
    openLinkFunction() {
      generateQuestion('countries', 'canada')
    },
    image: 'images/Canada Map.jpg',
    description: 'Provinces of Canada.',
  },
  {
    title: 'Japan',
    openLinkFunction() {
      generateQuestion('countries', 'japan')
    },
    image: 'images/Japan Map.jpg',
    description: 'Prefectures of Japan.',
  },
  {
    title: 'United States of America',
    openLinkFunction() {
      generateQuestion('countries', 'usa')
    },
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
