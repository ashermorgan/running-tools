<template>
  <div class="home">
    <p class="description">
      A collection of tools for runners that calculate splits, convert units, and more
    </p>
    <p>
      <router-link :to="{ name: 'calculate-paces' }">
        Pace Calculator
      </router-link>
      <router-link :to="{ name: 'calculate-units' }">
        Unit Calculator
      </router-link>
    </p>
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
a {
  margin: 0px 10px;
}
</style>
