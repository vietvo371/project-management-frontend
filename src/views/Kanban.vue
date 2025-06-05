<template>
    <div class="kanban">
        <draggable v-model="tasksByStatus.todo" group="tasks" @end="onDragEnd('todo')">
            <TaskCard v-for="task in tasksByStatus.todo" :key="task.id" :task="task" />
        </draggable>
        <draggable v-model="tasksByStatus.in_progress" group="tasks" @end="onDragEnd('in_progress')">
            <TaskCard v-for="task in tasksByStatus.in_progress" :key="task.id" :task="task" />
        </draggable>
        <draggable v-model="tasksByStatus.done" group="tasks" @end="onDragEnd('done')">
            <TaskCard v-for="task in tasksByStatus.done" :key="task.id" :task="task" />
        </draggable>
    </div>
</template>

<script>
import { useTaskStore } from '../stores/task';
import draggable from 'vue-draggable-next';
import TaskCard from '../components/TaskCard.vue';

export default {
    components: { draggable, TaskCard },
    setup() {
        const taskStore = useTaskStore();
        return { taskStore };
    },
    computed: {
        tasksByStatus() {
            return {
                todo: this.taskStore.tasks.filter(t => t.status === 'todo'),
                in_progress: this.taskStore.tasks.filter(t => t.status === 'in_progress'),
                done: this.taskStore.tasks.filter(t => t.status === 'done'),
            };
        },
    },
    methods: {
        async onDragEnd(status) {
            this.taskStore.tasks.forEach(async task => {
                if (task.status !== status) {
                    await this.taskStore.updateTaskStatus(task.id, status);
                }
            });
        },
    },
    async mounted() {
        await this.taskStore.fetchTasks(this.$route.params.projectId);
    },
};
</script>