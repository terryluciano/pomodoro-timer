import { LOCAL_STORAGE_TODOS_KEY } from '@/lib/constants';
import { defineStore } from 'pinia';
import { ref } from 'vue';
/**
 * @import { Ref } from "vue"
 */

/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {string} label
 * @property {boolean} checked
 */

/**
 *
 * @param {Todo[]} todos
 * @returns {Todo[]}
 */
const sortTodos = (todos) => {
    const unchecked = todos
        .filter((todo) => !todo.checked)
        .sort((a, b) => a.label.localeCompare(b.label));
    const checked = todos
        .filter((todo) => todo.checked)
        .sort((a, b) => a.label.localeCompare(b.label));

    return [...unchecked, ...checked];
};

export const useTodoStore = defineStore('todo', () => {
    /**
     *
     * @type {Ref<Todo[]>}
     */
    const todos = ref([]);

    const initialized = ref(false);

    /**
     * @param {string} label
     */
    const addTodo = (label) => {
        const id = todos.value.length + 1;

        todos.value.push({
            id,
            label,
            checked: false,
        });

        todos.value = sortTodos(todos.value);
    };

    /**
     *
     * @param {number} id
     * @param {string} label
     */
    const editTodo = (id, label) => {
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

    /**
     *
     * @param {number} id
     */
    const toggleCheckedTodo = (id) => {
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

    /**
     *
     * @param {number} id
     */
    const deleteTodo = (id) => {
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

        init,
        addTodo,
        editTodo,
        toggleCheckedTodo,
        deleteTodo,
    };
});
