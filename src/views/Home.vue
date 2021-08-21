<template>
  <div class="home">
    <p class="description">
      A collection of tools for runners that calculate splits, convert units, and more
    </p>
    <div class="calculators">
      <router-link :to="{ name: 'calculate-paces' }" v-slot="{ navigate }">
        <button @click="navigate">
          Pace Calculator
        </button>
      </router-link>
      <router-link :to="{ name: 'calculate-units' }" v-slot="{ navigate }">
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
  max-width: 500px;
  margin: auto;
}
.description {
  font-size: 1.5em;
  margin-bottom: 10px;
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
  }
}
</style>
