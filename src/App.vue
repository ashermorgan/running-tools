<script setup>
import { RouterLink, RouterView } from 'vue-router'
import VueFeather from 'vue-feather';
</script>

<template>
  <header>
    <router-link :to="{ name: $route.meta.back }" v-if="$route.meta.back"
      class="icon" title="Back">
      <vue-feather type="chevron-left" aria-hidden="true"/>
    </router-link>

    <h1 v-if="$route.meta.title">
      {{ $route.meta.title }}
    </h1>
    <h1 v-else>
      Running Tools
    </h1>
  </header>

  <div id="route-content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
  </div>
</template>

<style>
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
::v-deep(.feather-chevron-left) {
  padding: 0em;
  color: #000000;
}
header h1 {
  grid-column: 3;
  font-size: 2em;
  font-weight: bold;
  text-decoration: none;
  color: #000000;
}
#route-content {
  margin: 1em;
}
@media only screen and (max-width: 450px) {
  /* adjust title size to fit small devices */
  header h1 {
    font-size: 7vw;
  }
}
</style>
