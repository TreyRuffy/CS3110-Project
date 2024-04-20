<script setup lang="ts">
const roomCode = ref<string | null>(null)
const username = ref<string | null>(null)

function joinRoom() {
  if (!roomCode.value) {
    alert('Please enter a room code')
    return
  }
  if (!username.value) {
    alert('Please enter a username')
    return
  }
  // TODO join room logic
  console.log('Room code: ' + roomCode.value + '\nUsername: ' + username.value)
  roomCode.value = null
  username.value = null
}

const closeModal = () => {
  const modal = document.getElementById('join_room_modal') as HTMLDialogElement
  if (modal) {
    modal.close()
  }
}

const el = ref(null)
useSwipe(el, {
  onSwipeEnd(_, direction) {
    if (direction === 'down') {
      closeModal()
    }
  },
})
</script>

<template>
  <div>
    <div class="navbar z-[99] bg-base-200">
      <div class="navbar-start">
        <div class="dropdown">
          <button tabindex="0" role="button" class="btn btn-ghost lg:hidden">
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
          </button>
          <ul
            tabindex="0"
            class="menu dropdown-content menu-sm z-[98] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <NuxtLink to="/singleplayer" onclick="document.activeElement.blur()">
                Single Player
              </NuxtLink>
              <a
                tabindex="0"
                onclick="join_room_modal.showModal() && document.activeElement.blur()"
              >
                Multiplayer
              </a>
            </li>
          </ul>
        </div>
        <NuxtLink href="/" class="btn btn-ghost text-xl">Quizoot</NuxtLink>
      </div>
      <div class="navbar-center hidden lg:flex">
        <div class="dropdown dropdown-hover">
          <button tabindex="0" role="button" class="btn m-1 shadow">
            Play
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 18"
              stroke-width="1.2"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <ul class="menu dropdown-content z-[101] w-52 rounded-box bg-base-100 p-2 shadow">
            <li>
              <NuxtLink
                class="text-nowrap"
                to="/singleplayer"
                tabindex="0"
                onclick="document.activeElement.blur()"
              >
                Single Player
              </NuxtLink>
            </li>
            <li>
              <a
                class="text-nowrap"
                onclick="join_room_modal.showModal() && document.activeElement.blur()"
                tabindex="0"
              >
                Multiplayer
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="navbar-end">
        <button class="btn btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-6 w-6"
          >
            <path
              fill-rule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
    <dialog id="join_room_modal" class="modal modal-bottom sm:modal-middle">
      <div ref="el" class="modal-box">
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-md absolute right-2 top-2">✕</button>
        </form>
        <h3 class="bottom-2 text-center text-lg font-bold">Multiplayer</h3>
        <span class="mt-4 flex justify-center sm:hidden" @click="closeModal()">
          <NuxtLink href="/create-room" class="btn w-full px-8"> Create Room </NuxtLink>
          <br />
        </span>
        <form method="dialog" class="mt-2" @submit="joinRoom()">
          <label class="form-control w-full">
            <span class="flex justify-center sm:hidden">
              <span>- OR -</span>
            </span>
            <label for="room-code" class="input input-bordered mt-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M9.493 2.852a.75.75 0 0 0-1.486-.204L7.545 6H4.198a.75.75 0 0 0 0 1.5h3.14l-.69 5H3.302a.75.75 0 0 0 0 1.5h3.14l-.435 3.148a.75.75 0 0 0 1.486.204L7.955 14h2.986l-.434 3.148a.75.75 0 0 0 1.486.204L12.456 14h3.346a.75.75 0 0 0 0-1.5h-3.14l.69-5h3.346a.75.75 0 0 0 0-1.5h-3.14l.435-3.148a.75.75 0 0 0-1.486-.204L12.045 6H9.059l.434-3.148ZM8.852 7.5l-.69 5h2.986l.69-5H8.852Z"
                  clip-rule="evenodd"
                />
              </svg>

              <input
                id="room-code"
                v-model="roomCode"
                type="text"
                placeholder="Room code"
                class="grow"
                :maxlength="6"
                :required="true"
                oninput="this.value = this.value.toUpperCase()"
              />
            </label>

            <label for="username" class="input input-bordered mt-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z"
                />
              </svg>

              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Username"
                class="grow"
                :maxlength="32"
                :required="true"
              />
            </label>

            <span class="mt-4 flex justify-center">
              <input type="submit" class="btn btn-primary w-full px-8" value="Join Room" /> <br />
            </span>
            <span class="mt-4 hidden justify-center sm:flex">
              <span>- OR -</span>
            </span>
          </label>
        </form>
        <span class="mt-4 hidden justify-center sm:flex" @click="closeModal()">
          <NuxtLink href="/create-room" class="btn w-full px-8"> Create Room </NuxtLink>
          <br />
        </span>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped></style>
