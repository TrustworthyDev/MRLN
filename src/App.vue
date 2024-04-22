<template>
    <all-notifications />

    <router-view />
</template>

<script setup lang="ts">
import AllNotifications from "@/components/all-notifications/AllNotifications.vue";

</script>

<style lang="scss">
.vs__dropdown-option.vs__dropdown-option--selected {
    background-color: #d3d3d3;
}
</style>