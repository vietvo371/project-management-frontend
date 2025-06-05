<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Full name
      </label>
      <div class="mt-1">
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <div class="mt-1">
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <div class="mt-1">
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          autocomplete="new-password"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label
        for="password_confirmation"
        class="block text-sm font-medium text-gray-700"
      >
        Confirm Password
      </label>
      <div class="mt-1">
        <input
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          required
          autocomplete="new-password"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </div>

    <div class="text-sm text-center">
      <router-link
        to="/auth/login"
        class="font-medium text-indigo-600 hover:text-indigo-500"
      >
        Already have an account? Sign in
      </router-link>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { message } from 'ant-design-vue';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const handleSubmit = async () => {
  if (form.password !== form.password_confirmation) {
    message.error('Mật khẩu không khớp');
    return;
  }

  try {
    loading.value = true;
    await authStore.register(form);
    message.success('Tạo tài khoản thành công!');
    router.push('/');
  } catch (error) {
    message.error(error.response?.data?.message || 'Tạo tài khoản thất bại');
  } finally {
    loading.value = false;
  }
};
</script> 