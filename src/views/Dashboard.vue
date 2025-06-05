<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component
                :is="stat.icon"
                class="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ stat.name }}
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ stat.value }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Projects -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">Recent Projects</h2>
        <router-link
          to="/projects"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all
        </router-link>
      </div>
      <div class="border-t border-gray-200 divide-y divide-gray-200">
        <div
          v-for="project in recentProjects"
          :key="project.id"
          class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
          @click="router.push(`/projects/${project.id}`)"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                {{ project.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 line-clamp-1">
                {{ project.description }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex -space-x-2">
                <template v-for="member in project.members?.slice(0, 3)" :key="member.id">
                  <img
                    :src="member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`"
                    :alt="member.name"
                    class="w-6 h-6 rounded-full border-2 border-white"
                    :title="member.name"
                  />
                </template>
                <div
                  v-if="project.members?.length > 3"
                  class="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500"
                >
                  +{{ project.members.length - 3 }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">
                  {{ project.tasks_count }} tasks
                </span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Distribution Chart -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Task Distribution</h2>
      <div class="h-64">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import {
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
} from 'lucide-vue-next';
import Chart from 'chart.js/auto';

const router = useRouter();
const projectStore = useProjectStore();
const { projects, loading } = storeToRefs(projectStore);
const chartRef = ref(null);
let chart = null;

onMounted(async () => {
  try {
    await projectStore.fetchProjects();
    initChart();
  } catch (error) {
    message.error('Failed to load dashboard data');
  }
});

// Stats
const stats = computed(() => {
  const totalProjects = projects.value.length;
  const completedTasks = projects.value.reduce(
    (acc, project) =>
      acc + (project.tasks || []).filter((task) => task.status === 'done').length,
    0
  );
  const totalTasks = projects.value.reduce(
    (acc, project) => acc + (project.tasks || []).length,
    0
  );
  const totalMembers = new Set(
    projects.value.flatMap((project) => project.members || []).map((m) => m.id)
  ).size;

  return [
    {
      name: 'Total Projects',
      value: totalProjects,
      icon: FolderIcon,
    },
    {
      name: 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircleIcon,
    },
    {
      name: 'In Progress Tasks',
      value: totalTasks - completedTasks,
      icon: ClockIcon,
    },
    {
      name: 'Team Members',
      value: totalMembers,
      icon: UsersIcon,
    },
  ];
});

// Recent Projects
const recentProjects = computed(() => {
  return [...projects.value]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
});

// Chart
const initChart = () => {
  const ctx = chartRef.value.getContext('2d');
  const tasksByStatus = {
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
  };

  projects.value.forEach((project) => {
    (project.tasks || []).forEach((task) => {
      tasksByStatus[task.status]++;
    });
  });

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['To Do', 'In Progress', 'Review', 'Done'],
      datasets: [
        {
          data: Object.values(tasksByStatus),
          backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
};
</script> 