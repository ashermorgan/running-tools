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

<style scoped>
header a {
  grid-column: 1;
  margin: auto;
  height: 2em;
  width: 2em;
}
header :deep(.feather-chevron-left) {
  padding: 0em;
  color: #000000;
}
#route-content {
  margin: 1em;
}
</style>
