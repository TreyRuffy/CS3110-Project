<template>
  <div>
    <RoomTopNavigation :question-number="0" :max-question-number="0" :score="0" />
    <div class="flex h-screen flex-col items-center bg-primary align-text-top text-primary-content">
      <h1 class="m-4 text-center text-4xl font-bold">Scoreboard</h1>
      <div class="stats stats-vertical m-4 items-center justify-center shadow lg:stats-horizontal">
        <div class="stat">
          <div class="stat-value">1st</div>
          <div class="stat-title">Name</div>
          <div class="stat-desc">Score</div>
        </div>
        <div class="stat">
          <div class="stat-value">2nd</div>
          <div class="stat-title">Name</div>
          <div class="stat-desc">Score</div>
        </div>
        <div class="stat">
          <div class="stat-value">3rd</div>
          <div class="stat-title">Name</div>
          <div class="stat-desc">Score</div>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm m-2 sm:btn-sm md:btn-md lg:btn-lg">Exit</button>
    </div>
  </div>
</template>

<style scoped></style>
