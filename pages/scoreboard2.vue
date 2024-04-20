<template>
  <div>
    <RoomTopNavigation :question-number="0" :max-question-number="0" :score="0" />
    <div class="top-container">
      <h1>Scoreboard</h1>
      <button class="btn-lg-screen btn bg-primary">
        <h2>New Game</h2>
      </button>
    </div>
    <!--Container for screen under nav bar-->
    <div class="flex-space h-[calc(100vh-64px)] flex-col sm:flex-row">
      <!--Begin First Column-->
      <div class="podium-container">
        <div class="podium podium1 bg-primary">
          <p class="rank">1st!</p>
          <p class="name">Name</p>
        </div>
      </div>
      <div class="podium-container">
        <div class="podium podium2 bg-primary">
          <p class="rank">2nd!</p>
          <p class="name">Name</p>
        </div>
      </div>
      <div class="podium-container">
        <div class="podium podium3 bg-primary">
          <p class="rank">3rd!</p>
          <p class="name">Name</p>
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <button class="btn-sm-screen btn bg-primary">
        <h2>New Game</h2>
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
body,
html {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.top-container {
  flex: 1;
  text-align: center;
  margin: 2vh;
  margin-bottom: 0;
  font-size: 6vh;
  flex-shrink: 0;
}
.bottom-container {
  text-align: center;
  position: fixed;
  width: 100%;
}
.flex-space {
  height: calc(100vh - 6rem - 30vh);
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  overflow: hidden;
}
.podium-container {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: left;
  height: auto;
}
.podium {
  position: relative;
  height: 10vh;
  text-align: center;
  justify-content: center;
  border-radius: 0 1rem 1rem 0;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
}
.podium1 {
  width: 90vw;
}
.podium2 {
  width: 75vw;
}
.podium3 {
  width: 60vw;
}
.btn {
  display: flex;
  justify-content: center;
  margin: 8vh auto;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
}
.rank,
.name {
  font-size: 2vh;
  line-height: 1;
}
.rank {
  margin-top: 2vh;
  padding: 1vh;
  font-weight: bold;
}
.name {
  padding: 0.5vh;
  font-weight: bold;
  margin-bottom: 2rem;
}
.btn-lg-screen {
  display: none;
}
.btn-sm-screen {
  display: flex;
  margin-top: 2rem;
}
@media (min-width: 600px) {
  .flex-space {
    flex-direction: row;
    height: calc(100vh - 8rem - 28vh);
  }
  .podium-container:nth-child(1) {
    order: 2;
  }
  .podium-container:nth-child(2) {
    order: 1;
  }
  .podium-container:nth-child(3) {
    order: 3;
  }
  .podium1 {
    min-height: 35vh;
  }
  .podium2 {
    min-height: 25vh;
  }
  .podium3 {
    min-height: 17.5vh;
  }
  .podium {
    width: 75%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    border-radius: 1rem 1rem 0 0;
  }
  .podium-container {
    flex: 1;
    height: auto;
    align-items: flex-end;
    justify-content: center;
  }
  .name {
    margin-bottom: 1rem;
  }
  .rank,
  .name {
    font-size: calc(0.75rem + 0.2vw);
    padding: 2vh;
  }
  .btn-lg-screen {
    display: flex;
    position: relative;
    z-index: 1;
  }
  .btn-sm-screen {
    display: none;
  }
}
</style>
