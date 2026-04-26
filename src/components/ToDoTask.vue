<script lang="ts" setup>
import { useTodoStore } from '@/store/todo.store';
import { twMerge } from 'tailwind-merge';
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import CrossIcon from '@/components/icons/CrossIcon.vue';

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

const startX = ref(0);
const currentX = ref(0);
const isSwiping = ref(false);
const isDismissing = ref(false);
const activePointerId = ref<number | null>(null);

let dismissTimeoutId: number | null = null;

const swipeOffset = computed(() => {
    if (isDismissing.value) return '-110%';
    if (!isSwiping.value) return '0px';

    return `${Math.min(0, currentX.value - startX.value)}px`;
});

const swipeBackgroundText = computed(() =>
    props.checked ? 'Remove' : 'Complete'
);

const isInteractiveTarget = (target: EventTarget | null) => {
    return target instanceof HTMLElement
        ? !!target.closest('button, input, textarea, [contenteditable="true"]')
        : false;
};

const clearDismissTimeout = () => {
    if (dismissTimeoutId !== null) {
        clearTimeout(dismissTimeoutId);
        dismissTimeoutId = null;
    }
};

const resetSwipeState = () => {
    isSwiping.value = false;
    currentX.value = startX.value;
    activePointerId.value = null;
};

const editTask = () => {
    if (!taskSpanRef.value) return;

    if (taskSpanRef.value.innerText.trim() === '') {
        taskSpanRef.value.innerText = props.label;
        return;
    }

    todoStore.editTodo(props.taskId, taskSpanRef.value.innerText);
};

const onDragStart = (event: DragEvent) => {
    if (isInteractiveTarget(event.target)) {
        event.preventDefault();
        return;
    }

    // Cancel any in-flight swipe before native drag takes over.
    resetSwipeState();

    todoStore.setDraggedTodo(props.taskId);
    event.dataTransfer?.setData('text/plain', props.taskId);
    event.dataTransfer?.setDragImage(event.currentTarget as Element, 12, 12);
};

const onDragOver = (event: DragEvent) => {
    const draggedTodoId = todoStore.draggedTodoId;
    const draggedTodo = todoStore.todos.find(
        (todo) => todo.id === draggedTodoId
    );

    if (!draggedTodo || draggedTodo.checked !== props.checked) return;

    event.preventDefault();
};

const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const draggedTodoId =
        todoStore.draggedTodoId || event.dataTransfer?.getData('text/plain');

    if (!draggedTodoId) return;

    todoStore.reorderTodos(draggedTodoId, props.taskId);
    todoStore.setDraggedTodo(null);
};

const onDragEnd = () => {
    todoStore.setDraggedTodo(null);
};

const onPointerDown = (event: PointerEvent) => {
    if (isInteractiveTarget(event.target)) return;

    // Only engage swipe-to-dismiss for touch / pen. Mouse uses native HTML5
    // drag-and-drop for reordering, and mixing both pipelines causes the
    // swipe logic to race with the dragstart/drop events.
    if (event.pointerType === 'mouse') return;

    startX.value = event.clientX;
    currentX.value = event.clientX;
    isSwiping.value = true;
    activePointerId.value = event.pointerId;
};

const onPointerMove = (event: PointerEvent) => {
    if (!isSwiping.value) return;
    if (
        activePointerId.value !== null &&
        event.pointerId !== activePointerId.value
    )
        return;

    currentX.value = event.clientX;
};

const onPointerUp = (event: PointerEvent) => {
    if (!isSwiping.value) return;
    if (
        activePointerId.value !== null &&
        event.pointerId !== activePointerId.value
    )
        return;

    const distance = currentX.value - startX.value;
    isSwiping.value = false;
    activePointerId.value = null;

    if (distance > -70) {
        currentX.value = startX.value;
        return;
    }

    isDismissing.value = true;

    dismissTimeoutId = window.setTimeout(() => {
        dismissTimeoutId = null;
        if (props.checked) {
            todoStore.deleteTodo(props.taskId);
        } else {
            todoStore.toggleCheckedTodo(props.taskId);
        }
    }, 180);
};

onBeforeUnmount(() => {
    clearDismissTimeout();
    if (todoStore.draggedTodoId === props.taskId) {
        todoStore.setDraggedTodo(null);
    }
});
</script>

<template>
    <div class="relative overflow-hidden rounded-xl">
        <div
            class="absolute inset-0 flex items-center justify-end bg-white/20 px-4 text-xs font-semibold uppercase tracking-wider text-white/70"
        >
            {{ swipeBackgroundText }}
        </div>

        <div
            :class="
                twMerge(
                    'group relative flex cursor-grab touch-pan-y items-start gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 transition-colors hover:bg-white/15 active:cursor-grabbing',
                    isSwiping || isDismissing
                        ? 'transition-transform duration-150'
                        : 'transition-transform duration-200',
                    todoStore.draggedTodoId === props.taskId && 'opacity-50'
                )
            "
            :style="{ transform: `translateX(${swipeOffset})` }"
            draggable="true"
            @dragstart="onDragStart"
            @dragover="onDragOver"
            @drop="onDrop"
            @dragend="onDragEnd"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
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
                <CheckIcon
                    v-if="props.checked"
                    class="size-3 text-main-white"
                />
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
                <CrossIcon class="size-3.5" />
            </button>
        </div>
    </div>
</template>
