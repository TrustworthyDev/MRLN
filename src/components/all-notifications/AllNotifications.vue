<template>
    <div>
    <div class="notifications-container">
      <div v-for="notification in allNotifications" :key="notification.id">
        <div :class="`bg-${notification.type}`" class="notification" role="alert">
          <div class="d-flex align-items-center">
            <div class="notification-body">
              {{ notification.message }}
            </div>
            <button aria-label="Close" class="btn-close btn-close-white btn-sm ms-auto me-2"
              type="button" @click="() => notificationStore.removeFromNotifications(notification)"></button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

import { useNotificationStore } from '@/stores/notifications'
import { computed } from 'vue'


const notificationStore = useNotificationStore()
const allNotifications = computed(() => notificationStore.notifications)



</script>

<style lang="scss" scoped>
.notifications-container {
  display: block;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99999;
  width: 100%;

  @media (min-width: 991px) {
    margin-bottom: 5px;
    margin-right: 20px;
    width: auto;
    max-width: 500px;
  }
}

.notification {
  min-width: 300px;
  padding: 0.9rem 1rem;
  border-radius: 0;
  z-index: 9999;

  @media (min-width: 991px) {
    bottom: 20px;
    right: 20px;
    left: auto;
    min-width: 300px;
    padding: 0.6rem 1rem;
    border-radius: 3px;
    margin-top: 4px;
  }

  .notification-body {
    color: white;
    margin-right: 30px;
  }
}
</style>
