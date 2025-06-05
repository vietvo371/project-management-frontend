<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.getUser();
    } catch (error) {
      message.error('Session expired. Please login again.');
    }
  }
});
</script>

<style>
</style>
