<template>
  <div class="custom-popover">
    <span @mouseenter="showingTooltip = true" @mouseleave="showingTooltip = false">
     <vue-feather type="info" ></vue-feather>
    </span>
    <div v-if="showingTooltip" class="popover-content">
      <slot/>
    </div>
  </div>
</template>

<script>

export default {
  name: "PopOver",

  components: {
  },

  props: {
    icon: String
  },

  data() {
    return {
      showingTooltip: false
    }
  },
}
</script>

<style lang="scss" scoped>
.custom-popover {
  position: relative;
  display: inline-block;

  .popover-content {
    padding: 5px 6px;
    margin-top: 5px;
    display: block;
    position: absolute;
    right: 25px;
    background-color: #fff;
    min-width: 220px;
    max-width: 250px;
    overflow: auto;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    border: 1px solid rgba(0, 0, 0, 0.2);
    z-index: 99;
  }

}
</style>