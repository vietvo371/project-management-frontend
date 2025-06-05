<template>
    <form @submit.prevent="login">
        <input v-model="form.email" type="email" placeholder="Email" required>
        <input v-model="form.password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        return { authStore, router };
    },
    data() {
        return {
            form: { email: '', password: '' },
        };
    },
    methods: {
        async login() {
            try {
                await this.authStore.login(this.form);
                this.router.push('/dashboard');
            } catch (error) {
                console.error('Login failed', error);
            }
        },
    },
};
</script>