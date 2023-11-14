<template>
  <div class="fullscreen-modal">
    <div class="backdrop"></div>
    <div class="content-container">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FullscreenModal',
};
</script>

<style scoped>
.fullscreen-modal .backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #00000080;
}
.fullscreen-modal .content-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1010;
  overflow: scroll;
}

.fullscreen-modal .content {
  max-width: 500px;
  margin: 75px auto 1em;
  padding: 1em;
  background-color: var(--background1);
  border-radius: 10px;
}
</style>
