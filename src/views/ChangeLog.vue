<template>
  <div class="text" v-html="content"/>
</template>

<script setup lang="ts">
const content: string = __CHANGELOG_HTML__;
</script>

<style scoped>
</style>
