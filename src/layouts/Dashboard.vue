<template>
  <div>
    <MySpinner v-if="showSpinner"></MySpinner>

    <new-model-modal v-if="newModelStore.getIsOpen" />

    <div class="dashboard-wrapper">
      <vertical-nav-menu />
      <div class="dashboard-container">
        <router-view />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

// import Vue from 'vue';
// import NavBar from "@/components/dashboard/NavBar.vue";
import NewModelModal from "@/components/dashboard/NewModelModal.vue";
import VerticalNavMenu from "@/components/vertical-nav-menu/VerticalNavMenu.vue";
import { useNewModelStore } from '@/stores/newModel';
import { getCurrentInstance, onMounted, onUnmounted, ref } from "vue";
const app = getCurrentInstance();

const newModelStore = useNewModelStore();
const showSpinner = ref(false);
let $bus;
if (app != null) {
  $bus = app.appContext.config.globalProperties.$bus;
}

function toggleSpinner(isShow) {
  showSpinner.value = isShow;
}

onMounted(() => {
  // $bus.$on('showSpinner', toggleSpinner)
})

onUnmounted(() => {
  $bus.$off('showSpinner', toggleSpinner)
})

</script>

<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
}

.dashboard-container {
  grid-area: container;
  background-color: #f8f8f8 !important;
  padding: 0 2.2rem 2.2rem 2.2rem;
  width: 100vw;
  min-width: 300px;
  // overflow-x: hidden;
  // overflow-y: hidden;
}
</style>
