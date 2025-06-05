<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">Projects</h2>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Project
      </button>
    </div>

    <div v-if="loading" class="p-4 flex justify-center">
      <a-spin />
    </div>

    <div v-else class="border-t border-gray-200 divide-y divide-gray-200">
      <div
        v-for="project in projects"
        :key="project.id"
        class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
        @click="router.push(`/projects/${project.id}`)"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ project.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ project.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                project.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ project.status }}
            </span>
            <div class="flex -space-x-2">
              <template v-for="member in project.members?.slice(0, 3)" :key="member.id">
                <img
                  :src="member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`"
                  :alt="member.name"
                  class="w-8 h-8 rounded-full border-2 border-white"
                  :title="member.name"
                />
              </template>
              <div
                v-if="project.members?.length > 3"
                class="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500"
              >
                +{{ project.members.length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <a-modal
      v-model:visible="showCreateModal"
      title="Create Project"
      @ok="handleCreateProject"
      :confirmLoading="creating"
    >
      <a-form layout="vertical">
        <a-form-item label="Project Name" required>
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="form.description" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

const router = useRouter();
const projectStore = useProjectStore();
const { projects, loading } = storeToRefs(projectStore);

const showCreateModal = ref(false);
const creating = ref(false);
const form = ref({
  name: '',
  description: '',
});

onMounted(async () => {
  try {
    await projectStore.fetchProjects();
  } catch (error) {
    message.error('Failed to load projects');
  }
});

const handleCreateProject = async () => {
  if (!form.value.name) {
    message.error('Project name is required');
    return;
  }

  try {
    creating.value = true;
    await projectStore.createProject(form.value);
    message.success('Project created successfully');
    showCreateModal.value = false;
    form.value = { name: '', description: '' };
  } catch (error) {
    message.error('Failed to create project');
  } finally {
    creating.value = false;
  }
};
</script> 