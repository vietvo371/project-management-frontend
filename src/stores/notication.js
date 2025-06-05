import { defineStore } from "pinia"
import { notification } from "ant-design-vue";
import { h } from "vue";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from "@ant-design/icons-vue";
export const useNotificationStore = defineStore("notification", () => {
    const showSuccess = (description) => {
        notification.open({
          message: "Success",
          description,
          icon: h(CheckCircleOutlined, { style: { color: "#52c41a" } }),
          style: {
            border: "1px solid #b7eb8f",
            backgroundColor: "#f6ffed",
          },
        });
      }

     const showError = (description) => {
        notification.open({
          message: "Error",
          description,
          icon: h(CloseCircleOutlined, { style: { color: "#f5222d" } }),
          style: {
            border: "1px solid #ffa39e",
            backgroundColor: "#fff1f0",
          },
        });
      }
      const showWarning = (description) => {
        notification.open({
          message: "Warning",
          description,
          icon: h(ExclamationCircleOutlined, { style: { color: "#faad14" } }),
          style: {
            border: "1px solid #ffe58f",
            backgroundColor: "#fffbe6",
          },
        });
      }
      const showInfo = (description) => {
        notification.open({
          message: "Info",
          description,
          icon: h(InfoCircleOutlined, { style: { color: "#1890ff" } }),
          style: {
            border: "1px solid #91d5ff",
            backgroundColor: "#e6f7ff",
          },
        });
      }


  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})
