const appDiv = document.getElementById('app');

/** 
 * @typeDef {Object} TodoItem
 * @property {number} id - The id of the todo item
 * @property {string} title - The title of the todo item
 * @property {string} detail - Optional detail of the todo item
 * @property {boolean} completed - The status of the todo item
 */

/**
 * @typeDef {Array<TodoItem>} todoList
 * @description The list of todo
 * @default []
 */
let todoList = [];

/**
 * @typeDef {function} addTodo
 * @param {TodoItem} todo - The todo item to add
 * @description Add a todo to the list
 * @returns {void}
 */
const addTodo = function(todo) {
    todoList.push(todo);
    saveToLocalStorage();
}

/**
 * @typeDef {function} addTodoHandler
 * @description Add a todo to the list
 * @returns {void}
 */
const addTodoHandler = function() {
    const title = document.getElementById('todo-title').value;
    addTodo(createTodoItem(title));
    displayAllTodo();
    document.getElementById('todo-title').value = '';
}

/**
 * @typeDef {function} removeTodo
 * @param {number} id - The id of the todo to remove
 * @description Remove a todo from the list
 * @returns {void}
 * @example removeTodo(1)
 */
const removeTodo = function(id) {
    todoList = todoList.filter(todo => todo.id !== id);
    saveToLocalStorage();
}

/**
 * @typeDef {function} removeTodoHandler
 * @param {number} id - The id of the todo to remove
 * @description Remove a todo from the list
 * @returns {void}
 */
const removeTodoHandler = function(id) {
    removeTodo(id);
    displayAllTodo();
}

/**
 * @typeDef {function} generateId
 * @description Generate an id for a new todo item
 * @returns {number}
 */
const generateId = function() {
    let maxId = window.localStorage.getItem('maxId');
    if (!maxId) maxId = 0;
    if (maxId < todoList.length) throw new Error('maxId is greater than todoList length');
    maxId++;
    window.localStorage.setItem('maxId', maxId);
    return maxId;
}

/**
 * @typeDef {function} createTodoItem
 * @param {string} title - The title of the todo item
 * @param {string} detail - Optional detail of the todo item
 * @description Create a new todo item
 * @returns {TodoItem}
 */
const createTodoItem = function(title, detail='') {
    return {
        id: generateId(),
        title,
        detail,
        completed: false
    }
}

/**
 * @typeDef {function} setTodoCompleted
 * @param {number} id - The id of the todo item to set as completed
 * @description Set a todo item as completed
 * @returns {void}
 */
const setTodoCompleted = function(id) {
    todoList = todoList.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
        }
        return todo;
    });
}

/**
 * @typeDef {function} setTodoCompletedHandler
 * @param {number} id - The id of the todo item to set as completed
 * @description Set a todo item as completed
 * @returns {void}
 */
const setTodoCompletedHandler = function(id) {
    setTodoCompleted(id);
    saveToLocalStorage();
    displayAllTodo();
}

/**
 * @typeDef (function) modifyTodo
 * @param {number} id - The id of the todo item to modify
 * @param {string} title - The new title of the todo item
 * @param {string} detail - The new detail of the todo item
 * @description Modify a todo item
 * @returns {void}
 */
const modifyTodo = function(id, title, detail, completed) {
    todoList = todoList.map(todo => {
        if (todo.id === id) {
            todo.title = title;
            todo.detail = detail;
            todo.completed = completed;
        }
        return todo;
    });
}

/**
 * @typeDef {function} modifyTodoHandler
 * @param {number} id - The id of the todo item to modify
 * @description Modify a todo item
 * @returns {void}
 */
const modifyTodoHandler = function(id) {
    let title = document.getElementById('display-todo-title').value;
    let detail = document.getElementById('todo-detail').value;
    let completed = document.getElementById('todo-completed').checked;
    modifyTodo(id, title, detail, completed);
    saveToLocalStorage();
    displayAllTodo();
}

/**
 * @typeDef {function} saveToLocalStorage
 * @description Save the todo list to local storage
 * @returns {void}
 */
const saveToLocalStorage = function() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

/**
 * @typeDef {function} getFromLocalStorage
 * @description Get the todo list from local storage
 * @returns {void}
 */
const getFromLocalStorage = function() {
    const todoListString = localStorage.getItem('todoList');
    if (todoListString) {
        todoList = JSON.parse(todoListString);
    }
}

/**
 * @typeDef {function} createInputTodoHTML
 * @description Create the input todo HTML
 * @returns {string}
 */
const createInputTodoHTML = function() {
    return `
        <div><input type="text" id="todo-title">
        <button id="add-todo" onclick="addTodoHandler()">Add</button></div>
        <p>${todoList.length} items in Todo List</p>
        <hr>
    `;
}

/**
 * @typeDef {function} displayAllTodo
 * @description Display all todo in the list
 * @returns {void}
 */
const displayAllTodo = function() {
    appDiv.innerHTML = createInputTodoHTML();
    todoList.slice().reverse().forEach(todo => {
        const todoDiv = document.createElement('div');
        todoDiv.innerHTML = `
                <p>
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="setTodoCompletedHandler(${todo.id})">
                    <span data-completed="${todo.completed}">${todo.title}</span>
                </p>
                <button onclick="displayTodoDetail(${todo.id})">Detail</button>
                <button onclick="removeTodoHandler(${todo.id})">Remove</button>
            `;
        appDiv.appendChild(todoDiv);
    });
}

/**
 * @typeDef {function} displayTodoDetail
 * @param {number} id - The id of the todo item to display
 * @description Display the detail of a todo item
 * @returns {void}
 */
const displayTodoDetail = function(id) {
    const todo = todoList.find(todo => todo.id === id);
    appDiv.innerHTML = `
        <div><input type="text" id="display-todo-title" value="${todo.title}"></div>
        <div><textarea id="todo-detail">${todo.detail}</textarea></div>
        <div><input id="todo-completed" type="checkbox" ${todo.completed ? 'checked' : ''}> Completed</div>
        <button onclick="modifyTodoHandler(${todo.id})">Save</button>
        <button onclick="displayAllTodo()">Back</button>
    `;
}

/**
 * @typeDef {function} init
 * @description Initialize the app
 * @returns {void}
 */
const init = function() {
    getFromLocalStorage();
    displayAllTodo();
}

init();
