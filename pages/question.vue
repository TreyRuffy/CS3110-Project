<script setup lang="ts">
const score = 12000
const questionNumber = 1
const maxQuestions = 10
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="custom-grid grid w-full">
      <!-- Navbar -->
      <div>
        <RoomTopNavigation
          :max-question-number="maxQuestions"
          :question-number="questionNumber"
          :score="score"
        />
      </div>
      <!-- Top content -->
      <div>
        <h1 class="mx-3 mb-2 mt-4 text-center text-2xl font-semibold">
          What country does this flag belong to?
        </h1>
        <div class="grid w-fit lg:grid-cols-3">
          <div class="flex items-center justify-center">
            <!-- Timer for bigger screens -->
            <div
              class="hidden h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg lg:flex lg:h-24 lg:w-24"
            >
              <span class="countdown absolute flex font-mono text-2xl lg:text-4xl">
                <span style="--value: 41"></span>
              </span>
            </div>
          </div>
          <div class="relative mx-8 flex justify-center">
            <NuxtImg
              src="https://flagcdn.com/us.svg"
              format="webp"
              :height="42"
              alt="United States"
            />
            <!-- Timer for smaller screens -->
            <div
              class="absolute start-[-25px] top-[35%] flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg lg:hidden"
            >
              <span class="countdown flex font-mono text-2xl md:text-4xl">
                <span style="--value: 40"></span>
              </span>
            </div>
          </div>

          <!-- Submitted for larger screens -->
          <div class="mx-8 flex items-center justify-center">
            <h1 class="text-lg">Submitted 11/20</h1>
          </div>
        </div>
      </div>
      <!-- Bottom content -->
      <div class="h-full">
        <div class="mx-2 grid h-full grid-cols-2 grid-rows-2 gap-2">
          <div class="btn btn-primary btn-lg h-full">answer1</div>
          <div class="btn btn-secondary btn-lg h-full">answer2</div>
          <div class="btn btn-accent btn-lg h-full">answer3</div>
          <div class="btn btn-lg h-full bg-[#FCC93B]">answer4</div>
        </div>
      </div>
      <!-- Added space -->
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.custom-grid {
  grid-template-rows: 64px 1fr 1fr 10px;
}
</style>
