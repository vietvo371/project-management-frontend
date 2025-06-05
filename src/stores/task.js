import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTaskStore = defineStore('task', () => {
    const tasks = ref([]);
    const currentTask = ref(null);
    const loading = ref(false);

    const fetchTasks = async (projectId) => {
        try {
            loading.value = true;
            const response = await axios.get(`/api/projects/${projectId}/tasks`);
            tasks.value = response.data;
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const fetchTask = async (projectId, taskId) => {
        try {
            loading.value = true;
            const response = await axios.get(`/api/projects/${projectId}/tasks/${taskId}`);
            currentTask.value = response.data;
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const createTask = async (projectId, taskData) => {
        try {
            loading.value = true;
            const response = await axios.post(`/api/projects/${projectId}/tasks`, taskData);
            tasks.value.push(response.data);
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const updateTask = async (projectId, taskId, taskData) => {
        try {
            loading.value = true;
            const response = await axios.put(`/api/projects/${projectId}/tasks/${taskId}`, taskData);
            const index = tasks.value.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = response.data;
            }
            if (currentTask.value?.id === taskId) {
                currentTask.value = response.data;
            }
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const deleteTask = async (projectId, taskId) => {
        try {
            loading.value = true;
            await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`);
            tasks.value = tasks.value.filter(t => t.id !== taskId);
            if (currentTask.value?.id === taskId) {
                currentTask.value = null;
            }
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const updateTaskStatus = async (projectId, taskId, status) => {
        try {
            loading.value = true;
            const response = await axios.patch(`/api/projects/${projectId}/tasks/${taskId}/status`, { status });
            const index = tasks.value.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = response.data;
            }
            if (currentTask.value?.id === taskId) {
                currentTask.value = response.data;
            }
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const assignTask = async (projectId, taskId, userId) => {
        try {
            loading.value = true;
            const response = await axios.post(`/api/projects/${projectId}/tasks/${taskId}/assign`, { user_id: userId });
            const index = tasks.value.findIndex(t => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = response.data;
            }
            if (currentTask.value?.id === taskId) {
                currentTask.value = response.data;
            }
            return response.data;
        } catch (error) {
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        tasks,
        currentTask,
        loading,
        fetchTasks,
        fetchTask,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        assignTask,
    };
});