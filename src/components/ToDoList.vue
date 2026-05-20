<script lang="ts" setup>
import { twMerge } from 'tailwind-merge';
import ToDoTask from './ToDoTask.vue';
import { useTodoStore } from '@/store/todo.store';
import { ref, computed } from 'vue';
import Button from '@/components/common/Button.vue';
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import SortIcon from '@/components/icons/SortIcon.vue';
import CheckSquareIcon from '@/components/icons/CheckSquareIcon.vue';
import { useIsDesktop } from '@/composables/mediaQuery';

const open = defineModel({ type: Boolean, required: true });

const todoStore = useTodoStore();
const isDesktop = useIsDesktop();

const newTask = ref('');

const addTask = () => {
    todoStore.addTodo(newTask.value);
    newTask.value = '';
};

const toggleOpen = () => {
    open.value = !open.value;
};

const sections = computed(() => {
    const active = { label: 'Active', todos: todoStore.activeTodos };
    const completed = {
        label: 'Completed',
        todos: todoStore.completedTodos,
    };

    return todoStore.sortOrder === 'active-first'
        ? [active, completed]
        : [completed, active];
});

// Drag and drop state
const draggedTaskId = computed<string | null>({
    get: () => todoStore.draggedTaskId,
    set: (val) => {
        todoStore.draggedTaskId = val;
    },
});
const draggedSection = computed<'Active' | 'Completed' | null>({
    get: () => todoStore.draggedSection,
    set: (val) => {
        todoStore.draggedSection = val;
    },
});

// Track whether a drag is active to disable CSS transitions
const isDragging = ref(false);

// Throttle flag to prevent rapid-fire reorder calls
let reorderThrottled = false;
const REORDER_THROTTLE_MS = 50;

const handleDragStart = (
    e: DragEvent,
    taskId: string,
    sectionLabel: 'Active' | 'Completed'
) => {
    draggedTaskId.value = taskId;
    draggedSection.value = sectionLabel;
    isDragging.value = true;

    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', taskId);
    }
};

const handleDragOver = (
    e: DragEvent,
    taskId: string,
    sectionLabel: 'Active' | 'Completed'
) => {
    // Ignore if different section or same task
    if (
        draggedSection.value !== sectionLabel ||
        draggedTaskId.value === taskId
    ) {
        return;
    }
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
    }

    // Throttle reorders to prevent rapid oscillation
    if (reorderThrottled) return;

    // Midpoint detection: only swap if cursor has passed the vertical center of the target
    const target = (e.currentTarget as HTMLElement) || null;
    if (target) {
        const rect = target.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const section = sections.value.find((s) => s.label === sectionLabel);
        if (!section) return;

        const fromIndex = section.todos.findIndex(
            (t) => t.id === draggedTaskId.value
        );
        const toIndex = section.todos.findIndex((t) => t.id === taskId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        // Only reorder if dragging downward past midpoint, or upward above midpoint
        const movingDown = fromIndex < toIndex;
        if (movingDown && e.clientY < midpoint) return;
        if (!movingDown && e.clientY > midpoint) return;

        reorderThrottled = true;
        todoStore.reorderTodos(sectionLabel, fromIndex, toIndex);
        setTimeout(() => {
            reorderThrottled = false;
        }, REORDER_THROTTLE_MS);
    }
};

const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
};

const handleDragEnd = () => {
    draggedTaskId.value = null;
    draggedSection.value = null;
    // Delay re-enabling TransitionGroup so the DOM settles before
    // Vue can detect position diffs and apply list-move transitions
    requestAnimationFrame(() => {
        isDragging.value = false;
    });
};

const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    handleDragEnd();
};

// Touch-based drag and drop
let touchReorderThrottled = false;

const handleTouchStart = (
    e: TouchEvent,
    taskId: string,
    sectionLabel: 'Active' | 'Completed'
) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.drag-handle')) return;

    draggedTaskId.value = taskId;
    draggedSection.value = sectionLabel;
    isDragging.value = true;

    e.preventDefault();
};

const handleTouchMove = (e: TouchEvent) => {
    if (!draggedTaskId.value || !draggedSection.value) return;
    if (touchReorderThrottled) return;

    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
    ) as HTMLElement;
    if (!targetElement) return;

    const taskCard = targetElement.closest('[draggable="true"]') as HTMLElement;
    if (!taskCard) return;

    const taskId = taskCard.getAttribute('data-task-id');
    const sectionLabel = taskCard.getAttribute('data-section');

    if (
        taskId &&
        sectionLabel === draggedSection.value &&
        taskId !== draggedTaskId.value
    ) {
        // Midpoint check for touch
        const rect = taskCard.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        const section = sections.value.find((s) => s.label === sectionLabel);
        if (!section) return;

        const fromIndex = section.todos.findIndex(
            (t) => t.id === draggedTaskId.value
        );
        const toIndex = section.todos.findIndex((t) => t.id === taskId);

        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        const movingDown = fromIndex < toIndex;
        if (movingDown && touch.clientY < midpoint) return;
        if (!movingDown && touch.clientY > midpoint) return;

        touchReorderThrottled = true;
        todoStore.reorderTodos(
            sectionLabel as 'Active' | 'Completed',
            fromIndex,
            toIndex
        );
        setTimeout(() => {
            touchReorderThrottled = false;
        }, REORDER_THROTTLE_MS);
    }
};

const handleTouchEnd = () => {
    handleDragEnd();
};
</script>

<template>
    <div
        :class="
            twMerge(
                'w-auto h-full flex flex-row gap-0 items-center relative z-0',
                !isDesktop &&
                    'fixed top-0 left-0 w-full h-full backdrop-blur z-10 flex-col transition-all',
                !isDesktop && !open && '-top-full'
            )
        "
    >
        <div
            :class="
                twMerge(
                    'h-full flex-shrink-0 min-w-0 transition-all duration-300 ease-in-out w-80',
                    isDesktop && open ? 'ml-0' : '-ml-80 pointer-events-none',
                    !isDesktop &&
                        'w-full h-full flex-1 ml-0 pointer-events-auto',
                    !isDesktop && open && 'max-h-[calc(100%-32px)]'
                )
            "
        >
            <div
                :class="
                    twMerge(
                        'flex h-full w-80 flex-col overflow-hidden border-white/15 transition-opacity duration-300',

                        isDesktop ? 'border-r' : 'w-full h-full'
                    )
                "
            >
                <!-- Header -->
                <div class="flex-shrink-0 border-b border-white/15 px-4 py-4">
                    <h2
                        class="text-lg font-bold tracking-tight text-main-white"
                    >
                        To Do List
                    </h2>
                    <p class="text-xs text-white/60">
                        Stay focused, one task at a time
                    </p>
                </div>

                <!-- Input field -->
                <div class="flex-shrink-0 px-4 py-3">
                    <input
                        v-model="newTask"
                        type="text"
                        placeholder="Add a new task..."
                        class="w-full rounded-xl border border-white/25 bg-white/15 px-3 py-2 text-sm text-main-white outline-none transition placeholder-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/25"
                        @keyup.enter="addTask"
                    />
                </div>

                <!-- Task list (scrollable) -->
                <div class="min-h-0 flex-1 w-full overflow-y-auto px-4 pb-4">
                    <template v-if="todoStore.todos.length > 0">
                        <!-- Sort toggle -->
                        <div class="flex items-center justify-start pb-2">
                            <button
                                type="button"
                                class="flex items-center gap-1 rounded-lg py-0.5 text-[11px] text-white/40 transition-colors hover:text-white/60"
                                aria-label="Toggle sort order"
                                :disabled="todoStore.todos.length <= 0"
                                @click="
                                    () => {
                                        if (todoStore.todos.length > 0) {
                                            todoStore.toggleSortOrder();
                                        }
                                    }
                                "
                            >
                                <SortIcon class="size-3" />
                                Sort By:
                                <span>
                                    {{
                                        todoStore.sortOrder === 'active-first'
                                            ? 'Active'
                                            : 'Completed'
                                    }}
                                </span>
                            </button>
                        </div>

                        <!-- Task sections -->
                        <template
                            v-for="(section, index) in sections"
                            :key="section.label"
                        >
                            <Transition name="list-container">
                                <div
                                    v-if="section.todos.length > 0"
                                    :class="
                                        index > 0 &&
                                        sections[0].todos.length > 0
                                            ? 'mt-4'
                                            : ''
                                    "
                                >
                                    <div
                                        class="flex items-center justify-between gap-2 pb-2"
                                    >
                                        <div
                                            class="flex flex-row items-center gap-2 justify-between w-full"
                                        >
                                            <div
                                                class="flex flex-row gap-2 items-center"
                                            >
                                                <span
                                                    class="text-[11px] font-semibold uppercase tracking-wider text-white/40"
                                                >
                                                    {{ section.label }}
                                                </span>
                                                <span
                                                    class="text-[11px] tabular-nums text-white/25"
                                                >
                                                    {{ section.todos.length }}
                                                </span>
                                            </div>
                                            <Button
                                                v-show="
                                                    section.label ===
                                                    'Completed'
                                                "
                                                size="small"
                                                class="xs:h-8 h-6 xs:px-3 px-2"
                                                content-class="xs:text-base text-sm"
                                                @click="
                                                    todoStore.clearCompletedTodos
                                                "
                                            >
                                                <span
                                                    class="text-[11px] font-semibold uppercase tracking-wider text-white/40"
                                                >
                                                    Clear Completed
                                                </span>
                                            </Button>
                                        </div>
                                    </div>
                                    <TransitionGroup
                                        :name="isDragging ? '' : 'list'"
                                        tag="div"
                                        class="space-y-2"
                                    >
                                        <ToDoTask
                                            v-for="(
                                                task, taskIndex
                                            ) in section.todos"
                                            :key="task.id"
                                            :label="task.label"
                                            :checked="task.checked"
                                            :task-id="task.id"
                                            :data-task-id="task.id"
                                            :data-section="section.label"
                                            :data-index="taskIndex"
                                            @dragstart="
                                                handleDragStart(
                                                    $event,
                                                    task.id,
                                                    section.label as
                                                        | 'Active'
                                                        | 'Completed'
                                                )
                                            "
                                            @dragover="
                                                handleDragOver(
                                                    $event,
                                                    task.id,
                                                    section.label as
                                                        | 'Active'
                                                        | 'Completed'
                                                )
                                            "
                                            @dragleave="handleDragLeave"
                                            @dragend="handleDragEnd"
                                            @drop="handleDrop"
                                            @touchstart="
                                                handleTouchStart(
                                                    $event,
                                                    task.id,
                                                    section.label as
                                                        | 'Active'
                                                        | 'Completed'
                                                )
                                            "
                                            @touchmove="handleTouchMove"
                                            @touchend="handleTouchEnd"
                                        />
                                    </TransitionGroup>
                                </div>
                            </Transition>
                        </template>
                    </template>

                    <!-- Empty state -->
                    <div
                        v-else
                        class="flex h-full flex-col items-center justify-center gap-2 text-center"
                    >
                        <CheckSquareIcon class="size-10 text-white/20" />
                        <p class="text-sm text-white/40">No tasks yet</p>
                        <p class="text-xs text-white/25">
                            Add a task to get started
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div
            :class="
                twMerge(
                    'shrink-0 size-auto flex flex-col gap-0 group ',
                    isDesktop
                        ? 'absolute top-1/2 -translate-y-1/2 left-full'
                        : 'w-full h-8'
                )
            "
        >
            <p
                v-show="isDesktop"
                class="group-hover:opacity-80 opacity-0 transition duration-200 ease-out absolute -top-16 left-1/2 -translate-x-1/2 -rotate-90 font-bold text-lg leading-none shrink-0 text-nowrap pointer-events-none"
            >
                To Do List
            </p>
            <Button
                :on-click="toggleOpen"
                :class="
                    twMerge(
                        'rounded-none rounded-r-full xs:px-2 px-2 shrink-0 w-[34px] h-10',
                        !isDesktop &&
                            'rounded-br-2xl rounded-bl-2xl rounded-t-none xs:w-full w-full xs:h-full h-full',
                        !isDesktop && open && 'rounded-none'
                    )
                "
                size="small"
                content-class="flex flex-row gap-2 items-center justify-center"
            >
                <ChevronIcon
                    :class="
                        twMerge(
                            'size-5 shrink-0 transition-all duration-100 ease-in-out',
                            isDesktop
                                ? !open
                                    ? 'rotate-180'
                                    : ''
                                : !open
                                  ? '-rotate-90'
                                  : 'rotate-90'
                        )
                    "
                />
                <span>
                    {{ !isDesktop ? 'To Do List' : '' }}
                </span>
            </Button>
        </div>
    </div>
</template>

<style lang="css" scoped>
.list-move {
    transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.list-enter-active,
.list-leave-active {
    transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-10%);
}

.list-leave-active {
    position: absolute;
}

::-webkit-scrollbar {
    display: none;
}

* {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.list-container-enter-active,
.list-container-leave-active {
    transition: all 0.25s ease;
}

.list-container-enter-from,
.list-container-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
