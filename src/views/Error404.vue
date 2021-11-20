<template>
  <div class="error404">
    <h1>404 Not Found</h1>
    <p><router-link to="/home">homepage</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'Error404',
};
</script>

<style scoped>
h1 {
  font-size: 1.5em;
}
.error404 {
  text-align: center;
}
</style>
