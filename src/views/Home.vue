<template>
  <div class="home">
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
      <router-link :to="{ name: 'calculate-units' }" v-slot="{ navigate }" custom>
        <button @click="navigate">
          Unit Calculator
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.home {
  text-align: center;
  max-width: 600px;
  margin: auto;
}
.description {
  font-size: 1.5em;
  margin-bottom: 1em;
}
.calculators {
  display: flex;
  flex-direction: row;
}
.calculators button {
  flex-grow: 1;
  font-size: 1em;
  padding: 0.5em;
  margin: 0em 0.3em;
}
@media only screen and (max-width: 550px) {
  .calculators {
    flex-direction: column;
  }
  .calculators button {
    margin: 0.3em 0em;
    padding: 0.75em 0.5em;
  }
}
</style>
