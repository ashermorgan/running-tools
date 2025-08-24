<template>
  <div class="text" v-html="changelog_html"/>
</template>

<script setup lang="ts">
import markdownit from 'markdown-it'

import changelog_md from '/CHANGELOG.md?raw'

const changelog_html: string = markdownit({
  typographer: true, // needed to convert '--' to en-dash
}).render(changelog_md.slice(changelog_md.indexOf('\n') + 1)); // render without h1 on first line
</script>

<style scoped>
</style>
