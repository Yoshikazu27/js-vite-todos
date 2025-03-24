import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos, renderPending } from './use-cases';

const ElementIds = {
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    ClearCompletedButton: '.clear-completed',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIds.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIds.PendingCountLabel);
    }

    //Cuando la función App() se llama
    (() => {
        todoStore.initStore();
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    // Referencias HTML
    const newDescriptionInput = document.querySelector(ElementIds.NewTodoInput);
    const todoListUL = document.querySelector(ElementIds.TodoList);
    const clearCompletedButton = document.querySelector(ElementIds.ClearCompletedButton);
    const filtersLI = document.querySelectorAll(ElementIds.TodoFilters);

    // Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    });

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id]');

        if (event.target.classList.contains('destroy'))
            todoStore.deleteTodo(element.getAttribute('data-id'));
        else
            todoStore.toggleTodo(element.getAttribute('data-id'));

        displayTodos();
    });

    clearCompletedButton.addEventListener('click', (event) => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    filtersLI.forEach(element => {
        element.addEventListener('click', (event) => {
            filtersLI.forEach(el => el.classList.remove('selected'));
            event.target.classList.add('selected');

            switch (event.target.text) {
                case 'Todos':
                    todoStore.setSelectedFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setSelectedFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setSelectedFilter(Filters.Completed);
                    break;
                default:
                    
            }

            displayTodos();
        });
    });
}