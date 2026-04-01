<script setup>
import { useTodoStore } from '@/store/todo.store';
import { twMerge } from 'tailwind-merge';
import { useTemplateRef } from 'vue';

const props = defineProps({
    taskId: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
});

const todoStore = useTodoStore();

const taskSpanRef = useTemplateRef('taskSpan');

const editTask = () => {
    if (!taskSpanRef.value) return;

    if (taskSpanRef.value.innerText.trim() === '') {
        taskSpanRef.value.innerText = props.label;
        return;
    }

    todoStore.editTodo(props.taskId, taskSpanRef.value.innerText);
};
</script>

<template>
    <div
        class="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 transition-colors hover:bg-white/15"
    >
        <!-- Custom glassmorphic checkbox -->
        <button
            type="button"
            :class="
                twMerge(
                    'flex size-6 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-200',
                    props.checked
                        ? 'border-white/50 bg-white/40'
                        : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20'
                )
            "
            aria-label="Toggle task"
            @click="todoStore.toggleCheckedTodo(props.taskId)"
        >
            <svg
                v-if="props.checked"
                class="size-3 text-main-white"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M2 6l3 3 5-5" />
            </svg>
        </button>

        <!-- Task label -->
        <span
            ref="taskSpan"
            :class="
                twMerge(
                    'flex-1 text-sm xs:text-base transition-all duration-200 focus:outline-none',
                    props.checked
                        ? 'text-white/40 line-through'
                        : 'text-white/90'
                )
            "
            contenteditable="true"
            @blur.self="editTask"
        >
            {{ props.label }}
        </span>

        <!-- Hover-reveal delete button -->
        <button
            type="button"
            class="flex size-6 flex-shrink-0 items-center justify-center rounded-md text-white/0 transition-all duration-200 hover:bg-white/20 hover:text-white/90 group-hover:text-white/50"
            aria-label="Delete task"
            @click="todoStore.deleteTodo(props.taskId)"
        >
            <svg
                class="size-3.5"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M2 2l8 8M10 2l-8 8" />
            </svg>
        </button>
    </div>
</template>
