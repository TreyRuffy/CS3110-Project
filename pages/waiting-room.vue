<script setup lang="ts"></script>

<template>
  <div>
    <h1>Waiting Room</h1>
    <RoomCode room-code="123456" />
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
