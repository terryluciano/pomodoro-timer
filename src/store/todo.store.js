import { LOCAL_STORAGE_TODOS_KEY, CHARS } from '@/lib/constants';
import { defineStore } from 'pinia';
import { ref } from 'vue';
/**
 * @import { Ref } from "vue"
 */

/**
 * @typedef {Object} Todo
 * @property {string} id
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

/**
 * @returns {string}
 */
const generateId = () => {
    let id = '';

    for (let i = 0; i < 32; i++) {
        id += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    return id;
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
        const id = generateId();

        const cleanLaebl = label.trim();

        if (cleanLaebl.length === 0) return;

        todos.value.push({
            id,
            label: cleanLaebl,
            checked: false,
        });

        todos.value = sortTodos(todos.value);
    };

    /**
     *
     * @param {string} id
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
     * @param {string} id
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
     * @param {string} id
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
