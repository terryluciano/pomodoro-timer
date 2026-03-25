<script setup>
import { twMerge } from 'tailwind-merge';
import ToDoTask from './ToDoTask.vue';
import { useTodoStore } from '@/store/todo.store';

const open = defineModel({ type: Boolean, required: true });

const todoStore = useTodoStore();
</script>

<template>
    <div
        :class="
            twMerge(
                'h-full flex-shrink-0 min-w-0 transition-all duration-300 ease-in-out',
                open ? 'w-72 xs:w-80' : 'w-0'
            )
        "
    >
        <div
            :class="
                twMerge(
                    'flex h-full w-72 xs:w-80 flex-col overflow-hidden border-r border-white/15 transition-opacity duration-300',
                    open ? 'opacity-100' : 'opacity-0'
                )
            "
        >
            <!-- Header -->
            <div class="flex-shrink-0 border-b border-white/15 px-4 py-4">
                <h2 class="text-lg font-bold tracking-tight text-main-white">
                    Tasks
                </h2>
                <p class="text-xs text-white/60">
                    Stay focused, one task at a time
                </p>
            </div>

            <!-- Input field -->
            <div class="flex-shrink-0 px-4 py-3">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    class="w-full rounded-xl border border-white/25 bg-white/15 px-3 py-2 text-sm text-main-white outline-none transition placeholder-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/25"
                    @keyup.enter="
                        (e) => {
                            const value = e.target.value.trim();
                            if (value) {
                                todoStore.addTodo(value);
                                e.target.value = '';
                            }
                        }
                    "
                />
            </div>

            <!-- Task list (scrollable) -->
            <div class="flex-1 overflow-y-auto px-4 pb-4">
                <div v-if="todoStore.todos.length > 0" class="space-y-2">
                    <ToDoTask
                        v-for="task in todoStore.todos"
                        :key="task.id"
                        :label="task.label"
                        :checked="task.checked"
                        :task-id="task.id"
                    />
                </div>

                <!-- Empty state -->
                <div
                    v-else
                    class="flex h-full flex-col items-center justify-center gap-2 text-center"
                >
                    <svg
                        class="size-10 text-white/20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M9 11l3 3L22 4" />
                        <path
                            d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                        />
                    </svg>
                    <p class="text-sm text-white/40">No tasks yet</p>
                    <p class="text-xs text-white/25">
                        Add a task to get started
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
