<template>
  <div>
    <button 
      v-if="isMobile" 
      class="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      @click="toggleSidebar"
    >
      <MenuIcon v-if="!isOpen" size="24" />
      <XIcon v-else size="24" />
    </button>

    <aside
      class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 flex-shrink-0 flex flex-col h-full transition-all duration-300 ease-in-out z-40"
      :class="{
        'fixed inset-y-0 left-0 transform translate-x-0': isOpen && isMobile,
        'fixed inset-y-0 left-0 transform -translate-x-full': !isOpen && isMobile,
        'relative transform translate-x-0': !isMobile,
      }"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">Quản lý Bãi xe</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Hệ thống nhận diện AI</p>
      </div>

      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-2">
          <li v-for="item in navItems" :key="item.name">
            <router-link
              :to="item.href"
              class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="[
                $route.path === item.href
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <component :is="item.icon" class="mr-3 h-5 w-5" />
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <router-link to="/admin/profile">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <Shield class="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          <div class="ml-3">
            <!-- <p class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ user.ho_va_ten || "Admin" }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.ten_chuc_vu || "Admin" }}</p> -->
          </div>
        </div>
        </router-link>
        <button 
          @click="logout"
          class="w-full mt-4 justify-start text-gray-600 dark:text-gray-300 flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <LogOut class="mr-2 h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </aside>

    <div 
      v-if="isOpen && isMobile" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30" 
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notication";
import {
  Home,
  Car,
  Users,
  CreditCard,
  Camera,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart2,
  FileText,
  Shield,
  AlertCircle,
  LogIn,
  Clock,
  UserRoundCheck,
  Key,
  Bell
} from "lucide-vue-next";

export default {
  name: "Sidebar",
  components: {
    Home,
    Car,
    Users,
    CreditCard,
    Camera,
    Settings,
    MenuIcon: Menu,
    XIcon: X,
    LogOut,
    BarChart2,
    FileText,
    Shield,
    AlertCircle,
    LogIn,
    Clock,
    UserRoundCheck,
    Key
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const isOpen = ref(false);
    const isMobile = ref(false);
    const user = ref(authStore.getUser());
    const navItems = [
      { name: "Trang chủ", href: "/admin", icon: Home },
      { name: "Quản lý xe", href: "/admin/quan-ly-xe", icon: Car },
      { name: "Cư dân", href: "/admin/quan-ly-khach-hang", icon: Users },
      { name: "Khách vãng lai", href: "/admin/quan-ly-khach-vang-lai", icon: UserRoundCheck },
      { name: "Giao dịch", href: "/admin/quan-ly-giao-dich", icon: CreditCard },
      { name: "Báo cáo sự cố", href: "/admin/quan-li-bao-cao-su-co", icon: AlertCircle },
      { name: "Thông báo", href: "/admin/quan-ly-thong-bao", icon: Bell },
      { name: "Camera & AI", href: "/admin/quan-ly-camera", icon: Camera },
      { name: "Ra vào bãi", href: "/admin/quan-li-bai-giu-xe", icon: LogIn },
      { name: "Báo cáo", href: "/admin/quan-ly-bao-cao", icon: BarChart2 },
      { name: "Lịch sử ra vào", href: "/admin/quan-ly-lich-su", icon: Clock },
      { name: "Phân quyền", href: "/admin/phan-quyen", icon: Key   },
      { name: "Cài đặt", href: "/admin/quan-ly-cai-dat", icon: Settings },
    ];

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
    };

    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768;
    };

    const logout = () => {
      authStore.logout();
      router.push("/login");
      notificationStore.showSuccess("Đăng xuất thành công");
    };

    onMounted(() => {
      checkMobile();
      window.addEventListener("resize", checkMobile);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkMobile);
    });

    return {
      isOpen,
      isMobile,
      navItems,
      toggleSidebar,
      logout,
      user,
      Bell
    };
  },
};
</script>

<style>
</style>
