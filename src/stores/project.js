import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useProjectStore = defineStore('project', () => {
  const projects = ref([]);
  const currentProject = ref(null);
  const loading = ref(false);

  const fetchProjects = async () => {
    try {
      loading.value = true;
      const response = await axios.get('/api/projects');
      projects.value = response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchProject = async (id) => {
    try {
      loading.value = true;
      const response = await axios.get(`/api/projects/${id}`);
      currentProject.value = response.data;
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (projectData) => {
    try {
      loading.value = true;
      const response = await axios.post('/api/projects', projectData);
      projects.value.push(response.data);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      loading.value = true;
      const response = await axios.put(`/api/projects/${id}`, projectData);
      const index = projects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        projects.value[index] = response.data;
      }
      if (currentProject.value?.id === id) {
        currentProject.value = response.data;
      }
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const deleteProject = async (id) => {
    try {
      loading.value = true;
      await axios.delete(`/api/projects/${id}`);
      projects.value = projects.value.filter(p => p.id !== id);
      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    projects,
    currentProject,
    loading,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  };
});

