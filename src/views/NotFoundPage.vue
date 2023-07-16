<template>
  <div class="not-found-page">
    <h1>404 Not Found</h1>
    <p><router-link to="/home">homepage</router-link></p>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
};
</script>

<style scoped>
h1 {
  font-size: 1.5em;
}
.not-found-page {
  text-align: center;
}
</style>
