<script setup lang="ts"></script>

<template>
  <div>
    <div class="navbar z-[99] bg-base-200">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabindex="0"
            class="menu dropdown-content menu-sm z-[98] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <span>Room</span>
              <ul class="z-[101] p-2">
                <li><NuxtLink href="/create-room">Create Room</NuxtLink></li>
                <li><a onclick="join_room_modal.showModal()">Join Room</a></li>
              </ul>
            </li>
          </ul>
        </div>
        <NuxtLink href="/" class="btn btn-ghost text-xl">Quizoot</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li class="z-[101]">
            <details>
              <summary>Room</summary>
              <ul class="p-2">
                <li><NuxtLink class="text-nowrap" href="/create-room">Create Room</NuxtLink></li>
                <li><a class="text-nowrap" onclick="my_modal_5.showModal()">Join Room</a></li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div class="navbar-end">
        <button class="btn btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-md absolute right-2 top-2">✕</button>
        </form>
        <h3 class="bottom-2 text-lg font-bold">Join Room</h3>
        <form method="dialog">
          <label for="room-code">Room code:</label>
          <input type="text" placeholder="Room code" class="input input-bordered w-full" />
          <br />
          <label for="username">Username:</label>
          <input type="text" placeholder="Username" class="input input-bordered w-full" />
          <br />
          <div class="mt-4 flex justify-center">
            <div class="btn btn-primary px-8">Join</div>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped></style>
