<script setup lang="ts">
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

const socket = useSocket()

const connected = ref(false)
const response = ref([''])

onMounted(() => {
  socket.on('connect', () => {
    connected.value = socket.connected
  })
  socket.on('disconnect', () => {
    connected.value = socket.connected
  })
  socket.on('hello-response', (id: string, data: string, time: string) => {
    response.value.push(id + ' [' + time + ']: ' + data)
  })
  socket.on('dark', (data: boolean) => {
    useColorMode().preference = data ? 'dark' : 'light'
  })
})
</script>

<template>
  <div>
    <p>Home page</p>
    <CardSlider :items="cardItems" />
    <div>
      <h1>Color mode: {{ $colorMode.value }}</h1>
      <select v-model="$colorMode.preference">
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="sepia">Sepia</option>
      </select>
    </div>
    <div>Connected?: {{ connected }}</div>
    <button class="btn btn-success m-2" @click="socket.emit('hello', 'Hello World')">
      Hello World
    </button>
    <button
      class="btn btn-error m-2"
      @click="socket.emit('all-dark', useColorMode().preference !== 'dark')"
    >
      All Dark
    </button>
    <button class="btn btn-primary m-2" @click="socket.emit('handshake', 'trey')">
      Set username
    </button>
    <div>
      Response: <br />
      <div v-for="resp in response" :key="resp">{{ resp }}</div>
    </div>
  </div>
</template>
