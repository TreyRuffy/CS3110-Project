<script setup lang="ts">
const props = defineProps({
  position: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  hide: {
    type: Boolean,
    default: false,
  },
})

const rank = ref('')
switch (props.position) {
  case 1:
    rank.value = '1st!'
    break
  case 2:
    rank.value = '2nd!'
    break
  case 3:
    rank.value = '3rd!'
    break
  default:
    rank.value = `${props.position}th!`
}
</script>

<template>
  <div
    class="flex h-auto flex-1 items-center sm:items-end sm:justify-center"
    :class="[
      props.position === 1 ? 'sm:order-2' : props.position === 2 ? 'sm:order-1' : 'sm:order-3',
    ]"
  >
    <div
      class="relative grid h-[12vh] grid-rows-2 justify-center rounded-r-2xl bg-primary text-center shadow-[0_0_1rem_rgba(0,0,0,0.2)] sm:flex sm:!w-[75%] sm:flex-col sm:justify-center sm:rounded-b-[0] sm:rounded-t-2xl sm:p-4"
      :class="[
        props.position === 1
          ? 'w-[90vw] sm:min-h-[45vh]'
          : props.position === 2
            ? 'w-[75vw] sm:min-h-[35vh]'
            : 'w-[60vw] sm:min-h-[25vh]',
      ]"
    >
      <UiHeadingThree class="font-[600] sm:mt-4 sm:p-[1vh]">{{ rank }}</UiHeadingThree>
      <UiHeadingFour v-if="!hide" class="font-[500] sm:p-[1vh]">{{ name }}</UiHeadingFour>
      <UiHeadingFive v-if="!hide" class="font-[500] sm:mb-4 sm:p-[1vh]">{{ score }}</UiHeadingFive>
    </div>
  </div>
</template>
