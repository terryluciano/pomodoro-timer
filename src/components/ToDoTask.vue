<script lang="ts" setup>
import { useTodoStore } from '@/store/todo.store';
import { twMerge } from 'tailwind-merge';
import { useTemplateRef, ref } from 'vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import CrossIcon from '@/components/icons/CrossIcon.vue';
import GripVerticalIcon from '@/components/icons/GripVerticalIcon.vue';

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
const isDraggable = ref(false);

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
        :draggable="isDraggable"
        :class="
            twMerge(
                'group flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 hover:bg-white/15',
                todoStore.draggedTaskId === props.taskId
                    ? 'opacity-40 scale-[0.98] border-dashed border-white/25 shadow-inner'
                    : 'transition-colors duration-150',
                todoStore.draggedTaskId !== null && todoStore.draggedTaskId !== props.taskId
                    ? 'drag-active'
                    : ''
            )
        "
        @dragend="isDraggable = false"
        @mouseup="isDraggable = false"
    >
        <!-- Drag handle -->
        <div
            class="drag-handle cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors -ml-1 p-0.5 flex items-center justify-center rounded-md [&>*]:pointer-events-none"
            title="Drag to reorder"
            @mousedown="isDraggable = true"
        >
            <GripVerticalIcon class="size-4" />
        </div>

        <!-- Custom glassmorphic checkbox -->
        <button
            type="button"
            :class="
                twMerge(
                    'flex size-6 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-200 pointer-events-none xs:pointer-events-auto',
                    props.checked
                        ? 'border-white/50 bg-white/40'
                        : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20'
                )
            "
            aria-label="Toggle task"
            @click="todoStore.toggleCheckedTodo(props.taskId)"
        >
            <CheckIcon v-if="props.checked" class="size-3 text-main-white pointer-events-none" />
        </button>

        <!-- Task label -->
        <span
            ref="taskSpan"
            :class="
                twMerge(
                    'flex-1 text-sm xs:text-base transition-all duration-200 focus:outline-none pointer-events-none xs:pointer-events-auto',
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
            class="flex size-6 flex-shrink-0 items-center justify-center rounded-md text-white/0 transition-all duration-200 hover:bg-white/20 hover:text-white/90 group-hover:text-white/50 pointer-events-none xs:pointer-events-auto"
            aria-label="Delete task"
            @click="todoStore.deleteTodo(props.taskId)"
        >
            <CrossIcon class="size-3.5 pointer-events-none" />
        </button>
    </div>
</template>

<style scoped>
.drag-active * {
    pointer-events: none !important;
}
</style>
