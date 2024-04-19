<template>
  <div>
    <RoomTopNavigation :question-number="0" :max-question-number="0" :score="0" />
    <div class="flex h-[calc(100vh-64px)] columns-1 flex-row items-center sm:flex-row">
      <div class="relative flex h-[calc(100vh-64px)] w-1/3 justify-center">
        <div
          class="absolute bottom-0 h-1/2 w-3/4 rounded-xl bg-primary text-center shadow-lg shadow-black"
        >
          <p class="mt-14 p-4 text-2xl font-bold">2nd!</p>
          <p class="p-4 text-xl font-extrabold">Name</p>
        </div>
      </div>
      <div class="relative flex h-[calc(100vh-64px)] w-1/3 justify-center">
        <h1 class="p-4 text-6xl font-bold">Scoreboard</h1>
        <div
          class="absolute bottom-0 h-3/4 w-3/4 rounded-xl bg-primary text-center shadow-lg shadow-black"
        >
          <p class="mt-14 p-4 text-4xl font-extrabold">1st!</p>
          <p class="p-4 text-2xl font-semibold">Name</p>
        </div>
      </div>
      <div class="relative flex h-[calc(100vh-64px)] w-1/3 justify-center">
        <button
          class="btn btn-primary btn-lg btn-wide mt-16 rounded p-4 shadow-md shadow-black sm:btn-sm md:btn-md lg:btn-lg"
        >
          <h2 class="m-2">New Game</h2>
        </button>
        <div
          class="absolute bottom-0 h-1/4 w-3/4 rounded-xl bg-primary text-center shadow-lg shadow-black"
        >
          <p class="mt-14 p-4 text-2xl font-bold">3rd!</p>
          <p class="p-4 text-xl font-extrabold">Name</p>
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
}
</style>
