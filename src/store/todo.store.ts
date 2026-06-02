import { LOCAL_STORAGE_TODOS_KEY, CHARS } from '@/lib/constants';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Todo {
    id: string;
    label: string;
    checked: boolean;
}

type SortOrder = 'active-first' | 'completed-first';

const sortTodos = (
    todos: Todo[],
    sortOrder: SortOrder = 'active-first'
): Todo[] => {
    const unchecked = todos.filter((todo) => !todo.checked);
    const checked = todos.filter((todo) => todo.checked);

    return sortOrder === 'active-first'
        ? [...unchecked, ...checked]
        : [...checked, ...unchecked];
};

const generateId = (): string => {
    let id = '';

    for (let i = 0; i < 32; i++) {
        id += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    return id;
};

export const useTodoStore = defineStore('todo', () => {
    const todos = ref<Todo[]>([]);

    const initialized = ref(false);

    const sortOrder = ref<SortOrder>('active-first');

    const draggedTaskId = ref<string | null>(null);
    const draggedSection = ref<'Active' | 'Completed' | null>(null);
    const dragOverTaskId = ref<string | null>(null);
    const dragOverPosition = ref<'top' | 'bottom' | null>(null);

    const activeTodos = computed(() =>
        todos.value.filter((todo) => !todo.checked)
    );

    const completedTodos = computed(() =>
        todos.value.filter((todo) => todo.checked)
    );

    const toggleSortOrder = () => {
        sortOrder.value =
            sortOrder.value === 'active-first'
                ? 'completed-first'
                : 'active-first';
    };

    const addTodo = (label: string) => {
        const id = generateId();

        const cleanLabel = label.trim();

        if (cleanLabel.length === 0) return;

        todos.value.unshift({
            id,
            label: cleanLabel,
            checked: false,
        });

        todos.value = sortTodos(todos.value, sortOrder.value);
    };

    const editTodo = (id: string, label: string) => {
        const newTodos = sortTodos(
            todos.value.map((todo) => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        label,
                    };
                }

                return todo;
            }),
            sortOrder.value
        );

        todos.value = newTodos;
    };

    const toggleCheckedTodo = (id: string) => {
        const newTodos = sortTodos(
            todos.value.map((todo) => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        checked: !todo.checked,
                    };
                }

                return todo;
            }),
            sortOrder.value
        );

        todos.value = newTodos;
    };

    const deleteTodo = (id: string) => {
        todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    const clearCompletedTodos = () => {
        todos.value = todos.value.filter((todo) => !todo.checked);
    };

    const reorderTodos = (
        section: 'Active' | 'Completed',
        fromIndex: number,
        toIndex: number
    ) => {
        const active = [...activeTodos.value];
        const completed = [...completedTodos.value];

        if (section === 'Active') {
            if (
                fromIndex < 0 ||
                fromIndex >= active.length ||
                toIndex < 0 ||
                toIndex >= active.length
            )
                return;
            const [movedItem] = active.splice(fromIndex, 1);
            active.splice(toIndex, 0, movedItem);
        } else {
            if (
                fromIndex < 0 ||
                fromIndex >= completed.length ||
                toIndex < 0 ||
                toIndex >= completed.length
            )
                return;
            const [movedItem] = completed.splice(fromIndex, 1);
            completed.splice(toIndex, 0, movedItem);
        }

        todos.value =
            sortOrder.value === 'active-first'
                ? [...active, ...completed]
                : [...completed, ...active];
    };

    const init = () => {
        if (initialized.value) return;

        const storedTodos = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY);

        if (storedTodos) {
            const jsonTodos = JSON.parse(storedTodos) || [];

            todos.value = sortTodos(jsonTodos, sortOrder.value);
        }

        initialized.value = true;
    };

    return {
        todos,
        initialized,
        sortOrder,
        activeTodos,
        completedTodos,
        draggedTaskId,
        draggedSection,
        dragOverTaskId,
        dragOverPosition,

        init,
        addTodo,
        editTodo,
        toggleCheckedTodo,
        deleteTodo,
        toggleSortOrder,
        clearCompletedTodos,
        reorderTodos,
    };
});
