<script setup lang="ts"></script>

<template>
  <div>
    <h1>Waiting Room</h1>
    <div>Room Code: 123456</div>
    <RoomCode room-code="123456" class="w-[150px]" />
    <PlayerList
      :players="[
        'Mike',
        'AJ',
        'Trey',
        'Daniel',
        'Maddie',
        'Ash',
        'Peter',
        'David',
        'Liam',
        'Kelly',
      ]"
    />
  </div>
</template>

<style scoped></style>
