<template>
  <div class="">
    <p v-if="mark.length > 0">
      <span v-for="(value, index) in mark" v-if="mark.length > 0" :key="index">
        <span class="badge badge-warning text-white bg-success">{{ value.name }}</span>
        <br>
      </span>
    </p>

    <span v-else>
      <span class="badge badge-warning bg-warning">No value</span>
      <br>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, isProxy, toRaw } from 'vue';
export default {
  setup(props) {
    const mark = computed(() => {
      let rawData = props;
      if (isProxy(props)){
          rawData = toRaw(props)
      }
      return rawData.params.data.status
    })
    return { mark }
  }
}

</script>
