import { LOCAL_STORAGE_TODOS_KEY, CHARS } from '@/lib/constants';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Todo {
    id: string;
    label: string;
    checked: boolean;
    order: number;
}

type SortOrder = 'active-first' | 'completed-first';

const sortTodos = (todos: Todo[], sortOrder: SortOrder): Todo[] => {
    const unchecked = todos
        .filter((todo) => !todo.checked)
        .sort((a, b) => a.order - b.order);
    const checked = todos
        .filter((todo) => todo.checked)
        .sort((a, b) => a.order - b.order);

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

    const activeTodos = computed(() =>
        todos.value.filter((todo) => !todo.checked)
    );

    const completedTodos = computed(() =>
        todos.value.filter((todo) => todo.checked)
    );

    const draggedTodoId = ref<string | null>(null);

    const toggleSortOrder = () => {
        sortOrder.value =
            sortOrder.value === 'active-first'
                ? 'completed-first'
                : 'active-first';
    };

    const getMinOrder = (checked: boolean): number => {
        const group = todos.value.filter((todo) => todo.checked === checked);
        if (group.length === 0) return 1;

        return group.reduce(
            (min, todo) => (todo.order < min ? todo.order : min),
            group[0].order
        );
    };

    const addTodo = (label: string) => {
        const id = generateId();

        const cleanLabel = label.trim();

        if (cleanLabel.length === 0) return;

        const minOrder = getMinOrder(false);

        todos.value = sortTodos(
            [
                {
                    id,
                    label: cleanLabel,
                    checked: false,
                    order: minOrder - 1,
                },
                ...todos.value,
            ],
            sortOrder.value
        );
    };

    const editTodo = (id: string, label: string) => {
        const newTodos = todos.value.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    label,
                };
            }

            return todo;
        });

        todos.value = sortTodos(newTodos, sortOrder.value);
    };

    const toggleCheckedTodo = (id: string) => {
        const target = todos.value.find((todo) => todo.id === id);
        if (!target) return;

        const newChecked = !target.checked;
        const minOrderInNewGroup = getMinOrder(newChecked);

        const newTodos = todos.value.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    checked: newChecked,
                    order: minOrderInNewGroup - 1,
                };
            }

            return todo;
        });

        todos.value = sortTodos(newTodos, sortOrder.value);
    };

    const deleteTodo = (id: string) => {
        todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    const reorderTodos = (draggedId: string, targetId: string) => {
        if (draggedId === targetId) return;

        const newTodos = [...todos.value];
        const draggedIndex = newTodos.findIndex(
            (todo) => todo.id === draggedId
        );
        const targetIndex = newTodos.findIndex((todo) => todo.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        const dragged = newTodos[draggedIndex];
        const target = newTodos[targetIndex];
        if (dragged.checked !== target.checked) return;

        newTodos.splice(draggedIndex, 1);
        newTodos.splice(targetIndex, 0, dragged);

        let activeIndex = 0;
        let completedIndex = 0;

        todos.value = sortTodos(
            newTodos.map((todo) => ({
                ...todo,
                order: todo.checked ? ++completedIndex : ++activeIndex,
            })),
            sortOrder.value
        );
    };

    const setDraggedTodo = (id: string | null) => {
        draggedTodoId.value = id;
    };

    const init = () => {
        if (initialized.value) return;

        const storedTodos = localStorage.getItem(LOCAL_STORAGE_TODOS_KEY);

        if (storedTodos) {
            const jsonTodos = JSON.parse(storedTodos) || [];

            let activeIndex = 0;
            let completedIndex = 0;
            const todosWithOrder = jsonTodos.map((todo: Todo) => ({
                ...todo,
                order:
                    todo.order ??
                    (todo.checked ? ++completedIndex : ++activeIndex),
            }));

            todos.value = sortTodos(todosWithOrder, sortOrder.value);
        }

        initialized.value = true;
    };

    return {
        todos,
        initialized,
        sortOrder,
        activeTodos,
        completedTodos,
        draggedTodoId,

        init,
        addTodo,
        editTodo,
        toggleCheckedTodo,
        deleteTodo,
        toggleSortOrder,
        reorderTodos,
        setDraggedTodo,
    };
});
