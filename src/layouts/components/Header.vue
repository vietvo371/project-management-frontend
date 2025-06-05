<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between">
    <div class="flex items-center w-full max-w-md">
      <div class="relative w-full">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <input 
          type="search" 
          placeholder="Tìm kiếm biển số, cư dân..." 
          class="pl-9 w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
        />
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <div class="relative">
        <button 
          @click="toggleNotifications" 
          class="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell class="h-5 w-5" />
          <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div 
          v-if="showNotifications" 
          class="notification-dropdown absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-y-auto"
        >
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Thông báo</h3>
            <span class="text-sm text-gray-500">{{ notifications.length }} thông báo mới</span>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="notification in notifications" 
              :key="notification.id" 
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="whitespace-pre-line text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                    {{ notification.noi_dung_thong_bao }}
                  </div>
                  <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ convertDate(notification.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sticky bottom-0 bg-white dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
            <button class="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      </div>

      <button 
        @click="toggleTheme" 
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Sun v-if="isDark" class="h-5 w-5" />
        <Moon v-else class="h-5 w-5" />
      </button>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { Bell, Moon, Sun, Search } from "lucide-vue-next";
import baseRequest from "../../services/api";


export default {
  name: "Header",
  components: {
    Bell,
    Moon,
    Sun,
    Search,
  },
  setup() {
    const isDark = ref(false);
    const showNotifications = ref(false);
    const notifications = ref([]);
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle("dark", isDark.value);
      localStorage.setItem("theme", isDark.value ? "dark" : "light");
    };

    const toggleNotifications = (e) => {
      e.stopPropagation(); // Prevent event from bubbling up
      showNotifications.value = !showNotifications.value;
    };

    const closeNotifications = (e) => {
      if (showNotifications.value && !e.target.closest('.notification-dropdown') && !e.target.closest('button')) {
        showNotifications.value = false;
      }
    };
    const convertDate = (date) => {
      return new Date(date).toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };
    const getThongBao = async () => {
      try {
        const res = await baseRequest.get("admin/lay-du-lieu-thong-bao");
        if (res.data && res.data.data) {
          notifications.value = res.data.data;
        } else {
          notifications.value = []; // Set empty array if no data
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        notifications.value = []; // Set empty array on error
      }
    };

    onMounted(() => {
      getThongBao();
      // Kiểm tra theme từ localStorage hoặc system preference
      const savedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      isDark.value = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
      document.documentElement.classList.toggle("dark", isDark.value);

      // Add click event listener to document
      document.addEventListener("click", closeNotifications);
    });

    onUnmounted(() => {
      document.removeEventListener("click", closeNotifications);
    });

    return {
      isDark,
      showNotifications,
      notifications,
      toggleTheme,
      toggleNotifications,
      convertDate,
    };
  },
};
</script>

<style>
</style>
