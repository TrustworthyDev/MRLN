<template>
  <div :class="dashboardType === 'max' ? 'nav-item-sidebar--max' : 'nav-item-sidebar--min'">
    <div v-if="dashboardType === 'max'" class="d-flex align-items-center justify-content-start">
      <div class="nav--item" @click="accessUrl">
        <slot />
        <span class="nav-item-text">
          {{ itemText }}
        </span>
      </div>
    </div>
    <div v-else class="d-flex align-items-center justify-content-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();



// eslint-disable-next-line no-undef
const props = defineProps({
  dashboardType: String,
  itemText: String,
  routeName: String,
  disabled: Boolean
})

const accessUrl = () => {
  if(props.disabled) return
  
  if (props.routeName !== undefined) {
    // if (this.$route.name.toLowerCase() === this.routeName.toLowerCase()) return;
    router.push({ name: props.routeName });
  }
}

</script>

<style scoped lang="scss">
.nav-item-sidebar--max {
  width: 80%;
  padding: 0 15px;
  margin: 2px auto;
  cursor: pointer;
  transition: all .15s ease-in-out;

  &:hover {
    padding-left: 20px;
  }

  .nav-item-text {
    margin-left: 5px;
  }
}

.nav-item-sidebar--min {
  width: 70%;
  padding: 8px 15px;
  margin: 2px auto;
  cursor: pointer;
  border-radius: 3px;
  transition: all .15s ease-in-out;
}

.nav--item {
  border-radius: 4px;
  padding: 8px 2px;
}
</style>
