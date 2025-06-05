<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <button class="btn btn-primary">
        <span class="mr-2">New Project</span>
        <span class="text-sm">+</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Stats Card -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Statistics</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary-600">25</p>
            <p class="text-sm text-gray-500">Active Projects</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-secondary-600">142</p>
            <p class="text-sm text-gray-500">Total Tasks</p>
          </div>
        </div>
      </div>

      <!-- Recent Activity Card -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <div class="space-y-3">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <p class="text-sm text-gray-600">Project X completed</p>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <p class="text-sm text-gray-600">New task assigned</p>
          </div>
          <div class="flex items-center">
            <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <p class="text-sm text-gray-600">Meeting scheduled</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="card bg-white">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <button class="w-full btn btn-secondary">Create Task</button>
          <button class="w-full btn bg-green-500 text-white hover:bg-green-600">Schedule Meeting</button>
          <button class="w-full btn bg-yellow-500 text-white hover:bg-yellow-600">Generate Report</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView'
}
</script>