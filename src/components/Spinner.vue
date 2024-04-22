<template>
  <div class="spinner-container">
    <div class="spinner-backdrop">
      <RingLoader class="spinner" />
    </div>
  </div>
</template>

<script lang="ts">
import RingLoader from 'vue-spinner/src/RingLoader.vue'

export default {
  name: 'MySpinner',
  components: {
    RingLoader
  },
  props: {
    loading: Boolean
  }
}
</script>

<style>
.spinner-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  opacity: 0.8;
  z-index: 1000000000000;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>