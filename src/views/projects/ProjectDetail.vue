<template>
  <div v-if="loading" class="flex justify-center p-8">
    <a-spin size="large" />
  </div>

  <div v-else-if="project" class="space-y-6">
    <!-- Project Header -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ project.name }}</h2>
            <p class="mt-1 text-sm text-gray-500">{{ project.description }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <a-button type="primary" @click="showCreateTaskModal = true">
              Add Task
            </a-button>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="showEditProjectModal = true">
                    Edit Project
                  </a-menu-item>
                  <a-menu-item key="2" @click="showMembersModal = true">
                    Manage Members
                  </a-menu-item>
                  <a-menu-item
                    key="3"
                    danger
                    @click="confirmDeleteProject"
                  >
                    Delete Project
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <template #icon><more-vertical-icon /></template>
              </a-button>
            </a-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="flex space-x-4 overflow-x-auto pb-4">
      <div
        v-for="status in ['todo', 'in_progress', 'review', 'done']"
        :key="status"
        class="w-80 flex-shrink-0"
      >
        <div class="bg-gray-100 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-900 mb-4">
            {{ formatStatus(status) }}
            <span class="ml-2 text-gray-500">({{ getTasksByStatus(status).length }})</span>
          </h3>

          <draggable
            v-model="getTasksByStatus(status)"
            :group="{ name: 'tasks' }"
            item-key="id"
            class="space-y-3 min-h-[200px]"
            @end="handleDragEnd"
          >
            <template #item="{ element: task }">
              <div
                class="bg-white p-4 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
                @click="openTaskDetail(task)"
              >
                <h4 class="text-sm font-medium text-gray-900">{{ task.title }}</h4>
                <p class="mt-1 text-xs text-gray-500 line-clamp-2">
                  {{ task.description }}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <img
                      v-if="task.assignee"
                      :src="task.assignee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.name}`"
                      :alt="task.assignee.name"
                      class="w-6 h-6 rounded-full"
                      :title="task.assignee.name"
                    />
                    <span
                      v-else
                      class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500"
                      title="Unassigned"
                    >
                      ?
                    </span>
                    <span
                      :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getPriorityColor(task.priority),
                      ]"
                    >
                      {{ task.priority }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-500">
                    {{ formatDate(task.due_date) }}
                  </span>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <a-modal
      v-model:visible="showCreateTaskModal"
      title="Create Task"
      @ok="handleCreateTask"
      :confirmLoading="creatingTask"
    >
      <a-form layout="vertical">
        <a-form-item label="Title" required>
          <a-input v-model:value="taskForm.title" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="taskForm.description" :rows="4" />
        </a-form-item>
        <a-form-item label="Assignee">
          <a-select
            v-model:value="taskForm.assignee_id"
            placeholder="Select assignee"
            :options="project.members?.map(m => ({ value: m.id, label: m.name }))"
          />
        </a-form-item>
        <a-form-item label="Due Date">
          <a-date-picker v-model:value="taskForm.due_date" style="width: 100%" />
        </a-form-item>
        <a-form-item label="Priority">
          <a-select v-model:value="taskForm.priority">
            <a-select-option value="low">Low</a-select-option>
            <a-select-option value="medium">Medium</a-select-option>
            <a-select-option value="high">High</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Edit Project Modal -->
    <a-modal
      v-model:visible="showEditProjectModal"
      title="Edit Project"
      @ok="handleEditProject"
      :confirmLoading="editingProject"
    >
      <a-form layout="vertical">
        <a-form-item label="Project Name" required>
          <a-input v-model:value="editProjectForm.name" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="editProjectForm.description" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Task Detail Modal -->
    <a-modal
      v-model:visible="showTaskDetailModal"
      :title="selectedTask?.title"
      @ok="handleUpdateTask"
      :confirmLoading="updatingTask"
      width="600px"
    >
      <template v-if="selectedTask">
        <a-form layout="vertical">
          <a-form-item label="Title" required>
            <a-input v-model:value="selectedTask.title" />
          </a-form-item>
          <a-form-item label="Description">
            <a-textarea v-model:value="selectedTask.description" :rows="4" />
          </a-form-item>
          <a-form-item label="Assignee">
            <a-select
              v-model:value="selectedTask.assignee_id"
              placeholder="Select assignee"
              :options="project.members?.map(m => ({ value: m.id, label: m.name }))"
            />
          </a-form-item>
          <a-form-item label="Due Date">
            <a-date-picker
              v-model:value="selectedTask.due_date"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="Priority">
            <a-select v-model:value="selectedTask.priority">
              <a-select-option value="low">Low</a-select-option>
              <a-select-option value="medium">Medium</a-select-option>
              <a-select-option value="high">High</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { useTaskStore } from '@/stores/task';
import { storeToRefs } from 'pinia';
import { message, Modal } from 'ant-design-vue';
import { MoreVerticalIcon } from 'lucide-vue-next';
import draggable from 'vuedraggable';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const taskStore = useTaskStore();

const { currentProject: project, loading } = storeToRefs(projectStore);
const { tasks } = storeToRefs(taskStore);

// Modals
const showCreateTaskModal = ref(false);
const showEditProjectModal = ref(false);
const showTaskDetailModal = ref(false);

// Loading states
const creatingTask = ref(false);
const editingProject = ref(false);
const updatingTask = ref(false);

// Forms
const taskForm = ref({
  title: '',
  description: '',
  assignee_id: null,
  due_date: null,
  priority: 'medium',
});

const editProjectForm = ref({
  name: '',
  description: '',
});

const selectedTask = ref(null);

onMounted(async () => {
  try {
    await projectStore.fetchProject(route.params.id);
    await taskStore.fetchTasks(route.params.id);
  } catch (error) {
    message.error('Failed to load project');
    router.push('/projects');
  }
});

// Computed
const getTasksByStatus = (status) => {
  return computed(() => tasks.value.filter(t => t.status === status)).value;
};

// Methods
const formatStatus = (status) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };
  return colors[priority] || colors.medium;
};

const formatDate = (date) => {
  return date ? dayjs(date).format('MMM D') : '';
};

const handleCreateTask = async () => {
  if (!taskForm.value.title) {
    message.error('Task title is required');
    return;
  }

  try {
    creatingTask.value = true;
    await taskStore.createTask(route.params.id, {
      ...taskForm.value,
      status: 'todo',
    });
    message.success('Task created successfully');
    showCreateTaskModal.value = false;
    taskForm.value = {
      title: '',
      description: '',
      assignee_id: null,
      due_date: null,
      priority: 'medium',
    };
  } catch (error) {
    message.error('Failed to create task');
  } finally {
    creatingTask.value = false;
  }
};

const handleEditProject = async () => {
  if (!editProjectForm.value.name) {
    message.error('Project name is required');
    return;
  }

  try {
    editingProject.value = true;
    await projectStore.updateProject(route.params.id, editProjectForm.value);
    message.success('Project updated successfully');
    showEditProjectModal.value = false;
  } catch (error) {
    message.error('Failed to update project');
  } finally {
    editingProject.value = false;
  }
};

const confirmDeleteProject = () => {
  Modal.confirm({
    title: 'Are you sure you want to delete this project?',
    content: 'This action cannot be undone.',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      try {
        await projectStore.deleteProject(route.params.id);
        message.success('Project deleted successfully');
        router.push('/projects');
      } catch (error) {
        message.error('Failed to delete project');
      }
    },
  });
};

const handleDragEnd = async ({ item, to }) => {
  const newStatus = to.getAttribute('data-status');
  if (newStatus && item.status !== newStatus) {
    try {
      await taskStore.updateTaskStatus(route.params.id, item.id, newStatus);
    } catch (error) {
      message.error('Failed to update task status');
      // Refresh tasks to revert the UI
      await taskStore.fetchTasks(route.params.id);
    }
  }
};

const openTaskDetail = (task) => {
  selectedTask.value = { ...task };
  showTaskDetailModal.value = true;
};

const handleUpdateTask = async () => {
  if (!selectedTask.value.title) {
    message.error('Task title is required');
    return;
  }

  try {
    updatingTask.value = true;
    await taskStore.updateTask(route.params.id, selectedTask.value.id, selectedTask.value);
    message.success('Task updated successfully');
    showTaskDetailModal.value = false;
  } catch (error) {
    message.error('Failed to update task');
  } finally {
    updatingTask.value = false;
  }
};
</script> 