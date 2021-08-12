<template>
  <div id="app">
    <header>
      <router-link class="title" to="/home">running-calculator</router-link>
    </header>
    <div id="route-content">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
header {
  background-color: hsl(30, 100%, 50%);
  padding: 0.5em;
  text-align: center;
}
.title {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #000000;
}
#route-content {
  margin: 1em;
}
</style>
