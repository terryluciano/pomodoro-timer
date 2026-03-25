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

export const useTodoStore = defineStore('todo', () => {
    /**
     *
     * @type {Ref<Todo[]>}
     */
    const todos = ref([]);

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
    };

    /**
     *
     * @param {number} id
     * @param {string} label
     */
    const editTodo = (id, label) => {
        const newTodos = todos.value.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    label,
                };
            }

            return todo;
        });

        todos.value = newTodos;
    };

    /**
     *
     * @param {number} id
     */
    const toggleCheckedTodo = (id) => {
        const newTodos = todos.value.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    checked: !todo.checked,
                };
            }

            return todo;
        });

        todos.value = newTodos;
    };

    /**
     *
     * @param {number} id
     */
    const deleteTodo = (id) => {
        todos.value = todos.value.filter((todo) => todo.id !== id);
    };

    return {
        todos,

        addTodo,
        editTodo,
        toggleCheckedTodo,
        deleteTodo,
    };
});
