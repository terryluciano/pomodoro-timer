import { LOCAL_STORAGE_TODOS_KEY, CHARS } from '@/lib/constants';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Todo {
    id: string;
    label: string;
    checked: boolean;
}

type SortOrder = 'active-first' | 'completed-first';

const sortTodos = (todos: Todo[]): Todo[] => {
    const unchecked = todos.filter((todo) => !todo.checked);
    const checked = todos.filter((todo) => todo.checked);

    return [...unchecked, ...checked];
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

        const cleanLaebl = label.trim();

        if (cleanLaebl.length === 0) return;

        todos.value.unshift({
            id,
            label: cleanLaebl,
            checked: false,
        });

        todos.value = sortTodos(todos.value);
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
            })
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
            })
        );

        todos.value = newTodos;
    };

    const deleteTodo = (id: string) => {
        todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    const init = () => {
        if (initialized.value) return;

        const storedTodos = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY);

        if (storedTodos) {
            const jsonTodos = JSON.parse(storedTodos) || [];

            todos.value = sortTodos(jsonTodos);
        }

        initialized.value = true;
    };

    return {
        todos,
        initialized,
        sortOrder,
        activeTodos,
        completedTodos,

        init,
        addTodo,
        editTodo,
        toggleCheckedTodo,
        deleteTodo,
        toggleSortOrder,
    };
});
