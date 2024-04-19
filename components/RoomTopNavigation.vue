<script setup lang="ts">
defineProps({
  questionNumber: {
    type: Number,
    required: true,
  },
  maxQuestionNumber: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
})

const socketStore = useSocketStore()

const openModal = () => {
  const modal = document.getElementById('exit_modal') as HTMLDialogElement
  if (modal) {
    modal.showModal()
  }
}

const exitModal = () => {
  const modal = document.getElementById('exit_modal') as HTMLDialogElement
  if (modal) {
    modal.close()
  }
}

const router = useRouter()

const leaveRoom = () => {
  socketStore.disconnect()
  router.push('/')
}
</script>

<template>
  <div>
    <div class="navbar bg-base-200">
      <div class="navbar-start">
        <span v-if="questionNumber !== 0">{{ questionNumber }}/{{ maxQuestionNumber }}</span>
        <span v-else></span>
      </div>
      <div class="navbar-center">
        <span v-if="questionNumber !== 0">Score: {{ score }}</span>
        <span v-else></span>
      </div>
      <div class="navbar-end">
        <a class="btn btn-ghost btn-md text-[16px]" @click="openModal()"> Exit </a>
      </div>
    </div>
    <dialog id="exit_modal" class="modal modal-middle">
      <div ref="el" class="modal-box w-80 md:w-96">
        <form method="dialog">
          <button class="btn btn-circle btn-ghost btn-md absolute right-2 top-2">✕</button>
        </form>
        <h3 class="bottom-2 mb-2 text-center text-lg font-bold">Exit</h3>
        <p class="my-4 text-center text-lg">Are you sure you want to exit?</p>
        <form method="dialog">
          <label class="form-control w-full">
            <span class="mt-4 grid grid-cols-2 justify-center gap-2">
              <a class="btn btn-primary btn-md px-4" @click="leaveRoom()">Quit</a>
              <input type="submit" class="btn btn-error px-4" value="Cancel" @click="exitModal()" />
            </span>
          </label>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
