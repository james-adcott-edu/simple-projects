const appDiv = document.getElementById('app');

/** 
 * @typeDef {Object} TodoItem
 * @property {number} id - The id of the todo item
 * @property {string} title - The title of the todo item
 * @property {string} detail - Optional detail of the todo item
 * @property {boolean} completed - The status of the todo item
 */
function TodoItem(title) {
    this.id = generateId();
    this.title = title;
    this.detail = '';
    this.completed = false;
}

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
    localStorageSave();
}

/**
 * @typeDef {function} addTodoHandler
 * @description Add a todo to the list
 * @returns {void}
 */
const addTodoHandler = function() {
    const title = document.getElementById('todo-title').value.trim();
    if (!title) return;
    addTodo(new TodoItem(title));
    displayAllTodo();
    document.getElementById('todo-title').value = '';
}

/**
 * @typeDef {function} createInputTodoHTML
 * @description Create the input todo HTML
 * @returns {string}
 */
const createInputTodoHTML = function() {
    return `
        <div>
            <form onsubmit="addTodoHandler()">
                <input type="text" id="todo-title">
                <button id="add-todo" type="submit">Add</button>
            </form>
        </div>
        <p>${todoList.length} ${todoList.length===1 ? 'item':'items'} in Todo List</p>
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
    Array.from(todoList).reverse().forEach(todo => { // reverse the list to display the latest todo first
        const todoDiv = document.createElement('div');
        todoDiv.innerHTML = `
                <p>
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="setTodoCompletedHandler(${todo.id})">
                    <span class="todo-item" data-completed="${todo.completed}" onclick="displayTodoDetail(${todo.id})">${todo.title}</span>
                </p>
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
        <button onclick="displayAllTodo()">Back</button>
        <div><input type="text" id="display-todo-title" value="${todo.title}"></div>
        <div><textarea placeholder="extra detail" id="todo-detail">${todo.detail}</textarea></div>
        <div><input id="todo-completed" type="checkbox" ${todo.completed ? 'checked' : ''}> Completed</div>
        <button onclick="modifyTodoHandler(${todo.id})">Save</button>
        <button class="danger" onclick="removeTodoHandler(${todo.id})">Delete</button>
    `;
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
 * @typeDef {function} localStorageSave
 * @description Save the todo list to local storage
 * @returns {void}
 */
const localStorageSave = function() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

/**
 * @typeDef {function} localStorageGet
 * @description Get the todo list from local storage
 * @returns {void}
 */
const localStorageGet = function() {
    const todoListString = localStorage.getItem('todoList');
    if (todoListString) {
        todoList = JSON.parse(todoListString);
    }
}

/**
 * @typeDef (function) modifyTodo
 * @param {number} id - The id of the todo item to modify
 * @param {string} title - The new title of the todo item
 * @param {string} detail - The new detail of the todo item
 * @param {boolean} completed - The new status of the todo item
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
    let title = document.getElementById('display-todo-title').value.trim();
    if (!title) return;
    let detail = document.getElementById('todo-detail').value;
    let completed = document.getElementById('todo-completed').checked;
    modifyTodo(id, title, detail, completed);
    localStorageSave();
    displayAllTodo();
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
    localStorageSave();
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
    localStorageSave();
    displayAllTodo();
}

/**
 * @typeDef {function} init
 * @description Initialize the app
 * @returns {void}
 */
const init = function() {
    localStorageGet();
    displayAllTodo();
}

init();
