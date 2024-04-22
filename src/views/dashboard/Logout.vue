<template>
  <div class="text-center mt-5">
    <spinner/>
  </div>
</template>

<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { useAccountStore } from '@/stores/account';

const accountStore = useAccountStore();
accountStore.logout();
// import {mapActions} from "vuex";
// export default {
//   name: "Logout",
//   components: {Spinner},

//   methods: {
//     ...mapActions('account', ['logout'])
//   },

//   created() {
//     this.logout();
//   }

// }
</script>
