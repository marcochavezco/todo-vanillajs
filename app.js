"use strict";

// Elements

const addItemFormEl = document.querySelector(".add-item__form");
const addItemInput = document.querySelector(".add-item__input");
const addItemDate = document.querySelector(".add-item__date");
const addItemTime = document.querySelector(".add-item__time");
const addItemBtns = document.querySelector(".add-item__btn");

const nComplContainer = document.querySelector(".not-completed__container");
const complContainer = document.querySelector(".completed_container");

const state = {
  todos: [],
};

/**
 * When the form is submited gets form's text, then create the item object with an id, text and status by default 0
 * @param {DOMEvent} e
 */
const addItem = function (e) {
  e.preventDefault();

  // Get form text
  const itemText = addItemInput.value;
  if (itemText === "") return;

  // Create item
  const item = {
    id: (Date.now() + "").slice(-10),
    text: itemText,
    status: 0,
  };

  // Add item to todoList and update localStorage
  state.todos.push(item);

  setLocalStorage();

  // Clear form
  addItemInput.value = "";

  renderTodo(item);
};

/**
 * Set state.todos into localStorage
 */
const setLocalStorage = function () {
  localStorage.setItem("todos", JSON.stringify(state.todos));
};

/**
 * Marks as completed the clicked todo item and renders it as completed
 * @param {DOMEvent} e
 */
const completedItem = function (e) {
  // Works only if check button is clicked
  if (!e.target.classList.contains("todo__check")) return;

  const itemEl = e.target.closest(".todo__item");

  // Get item from todos by id
  const item = state.todos.find(i => i.id === itemEl.dataset.id);

  // Mark item's status to 1;
  item.status = 1;

  setLocalStorage();

  // Delete item from nComplContainer
  nComplContainer.removeChild(itemEl);

  // Render markup
  renderTodo(item);
};

/**
 * If todo item is checked as completed unmarks the item and renders it back as not-completed
 * @param {DOMEvent} e
 */
const unmarkComplItem = function (e) {
  if (!e.target.closest(".todo__check--complete")) return;

  const complItemEl = e.target.closest(".todo__item--completed");

  const complItem = state.todos.find(i => i.id === complItemEl.dataset.id);

  complItem.status = 0;

  setLocalStorage();

  complContainer.removeChild(complItemEl);

  renderTodo(complItem);
};

/**
 * Removes item from state.todos if trash element is clicked
 * @param {DOMEvent} e
 */
const deleteItem = function (e) {
  // Works only if thash is clicked
  if (!e.target.closest(".todo__trash")) return;

  // Select item
  const itemEl = e.target.closest(".todo__item");

  const item = state.todos.find(i => i.id === itemEl.dataset.id);

  // Remove item from state.todos
  state.todos = state.todos.filter(i => i !== item);

  setLocalStorage();

  // Remove itemEl
  const parentContainer = itemEl.parentElement;
  parentContainer.removeChild(itemEl);
};

/**
 * Based on todo item status render on screen the markup
 * @param {object} todo
 */
const renderTodo = function (todo) {
  const html = generateItemMarkup(todo);

  if (!todo.status) nComplContainer.insertAdjacentHTML("afterbegin", html);

  if (todo.status) complContainer.insertAdjacentHTML("afterbegin", html);
};

/**
 * Gets data from localStorage, set data as state.todos and render each todo item
 */
const renderLocalStorage = function () {
  // Get localStorage
  const data = JSON.parse(localStorage.getItem("todos"));

  if (!data) return;

  state.todos = data;

  state.todos.forEach(todo => renderTodo(todo));
};

/**
 * Generate markup for not-completed todo items and completed todo items
 * @param {array} todo
 * @returns {string}
 */
const generateItemMarkup = function (todo) {
  // If todo is not completed (status: 0)
  if (!todo.status) {
    return `
      <div class="todo__item" data-id="${todo.id}">
        <div class="todo__check"></div>
        <div class="todo__text">${todo.text}</div>
        <div class="todo__trash">
          <ion-icon
            class="todo__trash__icon"
            name="trash-outline"
          ></ion-icon>
        </div>
      </div>
    `;
  }

  // If todo is completed
  return `
  <div class="todo__item todo__item--completed" data-id="${todo.id}">
    <div class="todo__check todo__check--complete">
      <ion-icon
        class="todo__check__icon"
        name="checkmark-sharp"
      ></ion-icon>
    </div>
    <div class="todo__text todo__text--completed">
      ${todo.text}
    </div>
    <div class="todo__trash">
      <ion-icon
        class="todo__trash__icon"
        name="trash-outline"
      ></ion-icon>
    </div>
  </div>
  `;
};

const init = function () {
  renderLocalStorage();
  addItemFormEl.addEventListener("submit", addItem);

  nComplContainer.addEventListener("click", completedItem);
  nComplContainer.addEventListener("click", deleteItem);

  complContainer.addEventListener("click", unmarkComplItem);
  complContainer.addEventListener("click", deleteItem);
};

init();
