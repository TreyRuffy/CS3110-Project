<template>
  <div class="stack">
    <div v-for="(card, index) in cards" :key="index" v-show="currentIndex === index">
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

<script>
export default 
{
  data() 
  {
    //possible data needs to be in 4th position
    return { cards: [
      {title: 'Title 1', content: 'This is card 1 content'},
       {title: 'Title 2', content: 'This is card 2 content'},
        {title: 'Title 3', content: 'This is card 3 content'}],
         currentIndex:0,};
  },
  methods: {
    nextCard() {
      this.currentIndex++;
      if (this.currentIndex >= this.cards.length)
      {
        this.currentIndex = 0;
      }
    }
  }
}
</script>
 