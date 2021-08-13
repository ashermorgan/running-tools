<template>
  <div class="home">
    <router-link :to="{ name: 'calculate-paces' }">
      Pace Calculator
    </router-link>
    <router-link :to="{ name: 'calculate-units' }">
      Unit Calculator
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: { },
}
</script>

<style scoped>
.home {
  text-align: center;
}
a {
  margin: 0px 10px;
}
</style>
