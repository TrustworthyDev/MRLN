<template>
  <div class="login-container">
    <div class="container">
      <div>
        <form @submit.prevent="submitLogin">
          <div class="mb-3">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" required v-model="user.email">
          </div>
          <div class="mb-3">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" required v-model="user.password">
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { LoginResponse, User } from "@/types/User";
import { useAccountStore } from '@/stores/account';


interface UserLogin {
  email: string;
  password: string;
}

const accountStore = useAccountStore();
const user = reactive({ email: '', password: '' });
const isLoading = ref(false);

const submitLogin = () => {
  isLoading.value = true;
  accountStore.login({ email: user.email.toLowerCase(), password: user.password })

}

</script>

<style scoped lang="scss">
.login-container {
  position: fixed;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}
</style>
