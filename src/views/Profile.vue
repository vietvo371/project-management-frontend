<template>
  <div class="profile-page">
    <a-card title="Profile" :bordered="false">
      <a-descriptions title="User Info">
        <a-descriptions-item label="Username">
          {{ authStore.user?.username }}
        </a-descriptions-item>
        <a-descriptions-item label="Email">
          {{ authStore.user?.email }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.profile-page {
  padding: 24px;
}
</style> 