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
    <button class="btn-sm-screen btn bg-primary">
      <h2>New Game</h2>
    </button>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
.flex-space {
  position: relative;
  bottom: 0;
  height: calc(100vh - (20vh + (5rem + 3rem)));
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.podium-container {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: left;
}
.podium {
  position: relative;
  height: 75%;
  width: 30vw;
  margin-bottom: 1rem;
  text-align: center;
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
.top-container {
  text-align: center;
  margin-top: 5vh;
  margin-bottom: 2vh;
  font-size: 8vh;
}
.btn {
  display: flex;
  justify-content: center;
  margin: 1vh auto;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
}
.rank,
.name {
  font-size: 3vh;
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
}
.btn-lg-screen {
  display: none;
}
@media (min-width: 600px) {
  .large-screen-container {
    display: flex;
    flex-direction: column;
  }
  .flex-space {
    flex-direction: row;
    height: calc(100vh - (20vh + 4rem + 2rem));
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
  .podium-container {
    flex: 1;
    align-items: flex-end;
    justify-content: center;
  }
  .podium {
    width: 75%;
    border-radius: 1rem 1rem 0 0;
  }
  .podium1 {
    height: 60vh;
  }
  .podium2 {
    height: 45vh;
  }
  .podium3 {
    height: 40vh;
  }
  .rank,
  .name {
    font-size: calc(1rem + 0.5vw);
  }
  .btn-lg-screen {
    display: flex;
  }
  .btn-sm-screen {
    display: none;
  }
}
</style>
