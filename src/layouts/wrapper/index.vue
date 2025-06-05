<template>
    <div v-if="!isLoginPage" class="flex h-screen overflow-hidden">
      <Sidebar />
      <div class="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main class="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <router-view></router-view>
        </main>
      </div>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import Sidebar from "../../layouts/components/Sidebar.vue";
  import Header from "../../layouts/components/Header.vue";
  
  export default {
    name: "App",
    components: {
      Sidebar,
      Header,
    },
    setup() {
      const route = useRoute();
      const isLoginPage = computed(() => route.path === "/login");
  
      return {
        isLoginPage,
      };
    },
  };
  </script>
  
  <style>
  </style>
  