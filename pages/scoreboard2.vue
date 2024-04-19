<template>
  <div>
    <RoomTopNavigation :question-number="0" :max-question-number="0" :score="0" />
    <div class="flex h-[calc(100vh-64px)] flex-col sm:flex-row">
      <div class="relative flex flex-1 items-end justify-center sm:items-center">
        <div
          class="absolute bottom-0 h-1/3 w-3/4 rounded-t-xl bg-primary text-center shadow-lg shadow-black sm:bottom-0 sm:top-auto"
        >
          <p class="mt-[2vh] p-[1vh] text-[10vh] font-bold sm:text-[5vh]">2nd!</p>
          <p class="p-[.5vh] text-[8vh] font-extrabold sm:text-[4vh]">Name</p>
        </div>
      </div>
      <div class="relative flex flex-1 items-end justify-center sm:items-center">
        <h1 class="p-4 text-6xl font-bold">Scoreboard</h1>
        <div
          class="absolute bottom-0 h-1/2 w-3/4 rounded-t-xl bg-primary text-center shadow-lg shadow-black sm:bottom-0 sm:top-auto"
        >
          <p class="mt-[2vh] p-[1vh] text-[10vh] font-extrabold sm:text-[5vh]">1st!</p>
          <p class="p-[.5vh] text-[8vh] font-semibold sm:text-[4vh]">Name</p>
        </div>
      </div>
      <div class="relative flex flex-1 items-end justify-center sm:items-center">
        <button
          class="btn btn-primary btn-lg btn-wide mt-16 rounded p-4 shadow-md shadow-black sm:btn-sm md:btn-md lg:btn-lg"
        >
          <h2 class="m-2">New Game</h2>
        </button>
        <div
          class="absolute bottom-0 h-1/4 w-3/4 rounded-t-xl bg-primary text-center shadow-lg shadow-black sm:bottom-0 sm:top-auto"
        >
          <p class="mt-[2vh] p-[1vh] text-[10vh] font-bold sm:text-[5vh]">3rd!</p>
          <p class="p-[.5vh] text-[8vh] font-extrabold sm:text-[4vh]">Name</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .flex {
    flex-direction: column;
  }
  .relative {
    width: 100%;
    height: calc((100vh - 64px) / 3);
  }
  .absolute {
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
  }
  .font-bold,
  .font-extrabold,
  .font-semibold {
    font-size: calc(1rem + 1.5vw);
  }
}
</style>
