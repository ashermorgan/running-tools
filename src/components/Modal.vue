<template>
  <div class="modal">
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
  name: 'Modal',
};
</script>

<style scoped>
.modal .backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #00000080;
}
.modal .content-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1010;
  overflow: scroll;
}

.modal .content {
  max-width: 500px;
  margin: 75px auto 1em;
  padding: 1em;
  background-color: var(--background1);
  border-radius: 10px;
}
</style>
