<script setup>
import { twMerge } from 'tailwind-merge';
import ToDoTask from './ToDoTask.vue';
import { useTodoStore } from '@/store/todo.store';
import { ref, computed } from 'vue';
import Button from './common/Button.vue';
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
                            <div
                                v-if="section.todos.length > 0"
                                :class="
                                    index > 0 && sections[0].todos.length > 0
                                        ? 'mt-4'
                                        : ''
                                "
                            >
                                <div
                                    class="flex items-center justify-between gap-2 pb-2"
                                >
                                    <div
                                        class="flex flex-row items-center gap-2"
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
                                </div>
                                <TransitionGroup
                                    name="list"
                                    tag="div"
                                    class="space-y-2"
                                >
                                    <ToDoTask
                                        v-for="task in section.todos"
                                        :key="task.id"
                                        :label="task.label"
                                        :checked="task.checked"
                                        :task-id="task.id"
                                    />
                                </TransitionGroup>
                            </div>
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
                content-class="flex flex-row gap-2 items-center"
            >
                <ChevronIcon
                    :class="
                        twMerge(
                            'shrink-0 size-4 transition-all duration-100 ease-in-out',
                            isDesktop
                                ? open
                                    ? 'rotate-180'
                                    : ''
                                : open
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
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.25s ease;
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
</style>
