<script setup lang="ts"></script>

<template>
  <div class="stack">
    <div v-for="(card, index) in cards" v-show="currentIndex === index" :key="index">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">{{ card.title }}</h2>
          <p>{{ card.content }}</p>
          <div class="card-actions">
            <button class="btn btn-primary" @click="nextCard">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cards = [
  { title: 'Title 1', content: 'This is card 1 content' },
  { title: 'Title 2', content: 'This is card 2 content' },
  { title: 'Title 3', content: 'This is card 3 content' },
]

const currentIndex = ref(0)

function nextCard() {
  currentIndex.value++
  if (currentIndex.value >= cards.length) {
    currentIndex.value = 0
  }
}
</script>
