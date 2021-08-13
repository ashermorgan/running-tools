<template>
  <div id="app">
    <header>
      <router-link :to="{ name: $route.meta.back }" v-if="$route.meta.back"
        class="icon" title="Back">
        <img alt="" src="@/assets/chevron-left.svg"/>
      </router-link>

      <h1 v-if="$route.meta.title">
        {{ $route.meta.title }}
      </h1>
      <h1 v-else>
        running-calculator
      </h1>
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
  display: grid;
  grid-template-columns: 2em 1fr auto 1fr 2em;
  grid-template-rows: auto;
}
header a {
  grid-column: 1;
  margin: auto;
  height: 2em;
  width: 2em;
}
h1 {
  grid-column: 3;
  font-size: 2em;
  font-weight: bold;
  text-decoration: none;
  color: #000000;
}
#route-content {
  margin: 1em;
}
</style>
