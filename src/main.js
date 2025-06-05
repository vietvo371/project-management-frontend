import { createApp } from "vue"
import { createPinia } from "pinia"
import Antd from "ant-design-vue"
import Toast from "vue-toastification"
import axios from "axios"

import App from "./App.vue"
import router from "./router"

// Import CSS theo thứ tự
import "./assets/main.css" // Tailwind CSS
import "ant-design-vue/dist/reset.css" // Ant Design CSS
import "vue-toastification/dist/index.css"

import { notification, Popconfirm, Modal, Button, Select, Checkbox, Radio } from "ant-design-vue"

notification.config({
    placement: "topRight", // Default placement
    duration: 2, // Default duration
  });

// Configure axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.withCredentials = true

// Tạo ứng dụng Vue
const app = createApp(App)
// Tạo và sử dụng Pinia cho state management
const pinia = createPinia()
app.use(pinia)
// Sử dụng Vue Router
app.use(router)
app.use(Popconfirm)
app.use(Modal)
app.use(Button)
app.use(Select)
app.use(Checkbox)
app.use(Radio)
// Mount ứng dụng
app.mount("#app")
