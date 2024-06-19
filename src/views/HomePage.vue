<template>
  <div class="home-page">
    <p class="description">
      A collection of tools for runners and their coaches
    </p>
    <div class="calculators">
      <router-link :to="{ name: 'calculate-paces' }" v-slot="{ navigate }" custom>
        <button @click="navigate">
          Pace Calculator
        </button>
      </router-link>
      <router-link :to="{ name: 'calculate-races' }" v-slot="{ navigate }" custom>
        <button @click="navigate">
          Race Calculator
        </button>
      </router-link>
      <router-link :to="{ name: 'calculate-splits' }" v-slot="{ navigate }" custom>
        <button @click="navigate">
          Split Calculator
        </button>
      </router-link>
      <router-link :to="{ name: 'calculate-units' }" v-slot="{ navigate }" custom>
        <button @click="navigate">
          Unit Calculator
        </button>
      </router-link>
      <router-link :to="{ name: 'calculate-workouts' }" v-slot="{ navigate }" custom>
        <button @click="navigate">
          Workout Calculator
        </button>
      </router-link>
      <div class="card"></div>
    </div>
    <p class="about-link">
      <router-link :to="{ name: 'about' }">
        About Running Tools
      </router-link>
    </p>
  </div>
</template>

<style scoped>
.home-page {
  text-align: center;
  max-width: 700px;
  margin: auto;
}
.description {
  font-size: 1.5em;
}
.calculators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  justify-content: center;

  max-width: 39em;
  margin: 1em auto;
}
.calculators > * {
  width: 12em;
}
.calculators button {
  font-size: 1em;
  padding: 0.5em;
}
@media only screen and (max-width: 500px) {
  .calculators {
    gap: 0.75em;
  }
  .calculators button {
    padding: 0.75em 0.5em;
    width: 100%;
  }
}
</style>
