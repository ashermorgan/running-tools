<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

// TODO: fix icons
// import { ChevronLeftIcon } from 'vue-feather-icons';
</script>

<template>
  <header>
    <router-link :to="{ name: $route.meta.back }" v-if="$route.meta.back"
      class="icon" title="Back">
      <!-- <chevron-left-icon/> -->
      &#8592;
    </router-link>

    <h1 v-if="$route.meta.title">
      {{ $route.meta.title }}
    </h1>
    <h1 v-else>
      Running Tools
    </h1>
  </header>

  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<style scoped>
header {
  background-color: var(--theme);
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
header a svg {
  padding: 0em;
  color: #000000;
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
@media only screen and (max-width: 320px) {
  /* adjust title size to fit small devices */
  h1 {
    font-size: 8vw;
  }
}
</style>
