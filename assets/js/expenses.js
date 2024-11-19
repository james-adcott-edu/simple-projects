const appDiv = document.getElementById('app');
let expenseList = [];

/**
 * @typedef {Object} ExpenseItem
 * @property {string} id - The unique identifier
 * @property {string} name - The name of the expense
 * @property {number} amount - The amount of the expense
 * @property {string} date - The date of the expense
 * @property {date} paidDate - The date the expense was paid
 * @property {string} expenseStatus - The status of the expense: eg. 'unpaid' 'paid' 'overdue' 'void'
 */
function ExpenseItem(name, amount, date) {
    this.id = generateId();
    this.name = name;
    this.amount = amount;
    this.date = date;
    this.paidDate = undefined;
    this.expenseStatus = 'unpaid';
}

/**
 * @typedef {Object} addExpense
 * @param {ExpenseItem} expense - The expense to add
 * @description Adds an expense to the list
 * @returns {void}
 */
const addExpense = (expense) => {
    expenseList.push(expense);
    localStorageSave();
}

/**
 * @typedef {Object} addExpenseHandler
 * @description Handles the form submission for adding an expense
 * @returns {void}
 */
const addExpenseHandler = (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const expense = new ExpenseItem(name, amount, date);
    addExpense(expense);
    displayAllExpenses();
}

/**
 * @typeDef {function} displayAllExpenses
 * @description Display all expenses in the list
 * @returns {void}
 */
const displayAllExpenses = function() {
    appDiv.innerHTML = '';
    appDiv.appendChild(createExpenseFormHTML());
    const totalUnpaid = expenseList.reduce((acc, expense) => {
        if (expense.expenseStatus === 'unpaid') {
            return acc + Number(expense.amount);
        }
        return acc;
    }, 0);
    appDiv.innerHTML += `
        <p>Total Unpaid: ${totalUnpaid}</p>
    `;
    const expenseTable = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
    <th>Date</th>
    <th>Name</th>
    <th>Amount</th>
    <th>Status</th>
    `;
    expenseTable.appendChild(headerRow);
    expenseList.forEach(expense => {
        const expenseRow = document.createElement('tr');
        expenseRow.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.name}</td>
            <td>${expense.amount}</td>
            <td>${expense.expenseStatus}</td>
            `;
        expenseRow.addEventListener('click', () => displayExpenseDetail(expense.id));
        expenseTable.appendChild(expenseRow);
    });
    appDiv.appendChild(expenseTable);
}

/**
 * @typeDef {function} generateId
 * @description Generate an id for a new todo item
 * @returns {number}
 */
const generateId = function() {
    let maxId = window.localStorage.getItem('maxExpenseId');
    if (!maxId) maxId = 0;
    if (maxId < expenseList.length) throw new Error('maxId is greater than expenseList length');
    maxId++;
    window.localStorage.setItem('maxExpenseId', maxId);
    return maxId;
}

const createExpenseFormHTML = () => {
    const form = document.createElement('form');
    form.innerHTML = `
        <input type="text" id="name" placeholder="Name">
        <input type="number" id="amount" placeholder="Amount">
        <input type="date" id="date" placeholder="Date">
        <button type="submit">Add Expense</button>
    `;
    form.addEventListener('submit', addExpenseHandler);
    return form;
}

/**
 * @typeDef {function} localStorageSave
 * @description Save the todo list to local storage
 * @returns {void}
 */
const localStorageSave = function() {
    localStorage.setItem('expenseList', JSON.stringify(expenseList));
}

/**
 * @typeDef {function} localStorageGet
 * @description Get the todo list from local storage
 * @returns {void}
 */
const localStorageGet = function() {
    const expenseListString = localStorage.getItem('expenseList');
    if (expenseListString) {
        expenseList = JSON.parse(expenseListString);
    }
}


/**
 * @typeDef {function} init
 * @description Initialize the app
 * @returns {void}
 */
const init = function() {
    localStorageGet();
    displayAllExpenses();
}

/**
 * @typeDef {function} displayExpenseDetail
 * @param {number} id - The id of the expense item to display
 * @description Display the detail of an expense item
 * @returns {void}
 */
const displayExpenseDetail = function(id) {
    const expense = expenseList.find(expense => expense.id === id);
    appDiv.innerHTML = `
        <button onclick="displayAllExpenses()">Back</button>
        <div><input type="text" id="display-expense-name" value="${expense.name}"></div>
        <div><input type="number" id="display-expense-amount" value="${expense.amount}"></div>
        <div><input type="date" id="display-expense-date" value="${expense.date}"></div>
        <div><input id="expense-paid" type="checkbox" ${expense.expenseStatus === 'paid' ? 'checked' : ''}> Paid</div>
        <button onclick="modifyExpenseHandler(${expense.id})">Save</button>
    `;
}

/**
 * @typeDef {function} modifyExpenseHandler
 * @param {number} id - The id of the expense item to modify
 * @description Modify an expense item
 * @returns {void}
 */
const modifyExpenseHandler = function(id) {
    const name = document.getElementById('display-expense-name').value.trim();
    const amount = document.getElementById('display-expense-amount').value;
    const date = document.getElementById('display-expense-date').value;
    const expenseStatus = document.getElementById('expense-paid').checked ? 'paid' : 'unpaid';
    modifyExpense(id, name, amount, date, expenseStatus);
    localStorageSave();
    displayAllExpenses();
}

/**
 * @typeDef {function} modifyExpense
 * @param {number} id - The id of the expense item to modify
 * @param {string} name - The new name of the expense item
 * @param {number} amount - The new amount of the expense item
 * @param {string} date - The new date of the expense item
 * @param {string} expenseStatus - The new status of the expense item
 * @description Modify an expense item
 * @returns {void}
 */
const modifyExpense = function(id, name, amount, date, expenseStatus) {
    expenseList = expenseList.map(expense => {
        if (expense.id === id) {
            expense.name = name;
            expense.amount = amount;
            expense.date = date;
            expense.expenseStatus = expenseStatus;
        }
        return expense;
    });
}

init();
