<template>
  <div>
    <nav class="navbar navbar-light custom-navbar">
      <div class="container">
        <router-link to="/dashboard">
          <logo width="30px"/>
        </router-link>
      </div>
    </nav>
    <nav class="shadow bottom-nav">
      <div class="container">
        <router-link class="me-2 text-secondary" to="/dashboard">Dashboard</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/agencies">Agencies</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/find-and-replace">Find & Replace</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/sectors">Sectors</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/statuses">Statuses</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/tags">Tags</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/classifications">Classifications</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/federal-register-publications">Federal Register
          Publications
        </router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/filing-types">Filing Types</router-link>
        <router-link class="me-2 text-secondary" to="/dashboard/alert-types">Alert Types</router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
// import Icon from '@/assets/images/icon.svg';
import Logo from "@/components/Logo.vue";

</script>

<style scoped>
.custom-navbar {
  background-color: white;
  border-bottom: 1px solid #c4c4c4;
}

.bottom-nav {
  padding: 6px 0;
  background-color: #f1f1f1;
}
</style>
