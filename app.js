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

const addItem = function (e) {
  e.preventDefault();

  // Get form text
  const itemText = addItemInput.value;
  console.log(itemText);

  // Create item

  const item = {
    id: (Date.now() + "").slice(-10),
    text: itemText,
    status: 0,
  };

  // Add item to todoList and update localStorage
  state.todos.push(item);
  console.log(state);

  setLocalStorage();

  // Clear form
  addItemInput.value = "";

  renderTodo(item);
};

const setLocalStorage = function () {
  localStorage.setItem("todos", JSON.stringify(state.todos));
};

const completedItem = function (e) {
  // Works only if check button is clicked
  if (!e.target.classList.contains("todo__check")) return;

  const itemEl = e.target.closest(".todo__item");
  console.log(itemEl);

  // Get item from todos by id
  const item = state.todos.find(i => i.id === itemEl.dataset.id);
  console.log(item);

  // Mark item's status to 1;
  item.status = 1;

  setLocalStorage();

  // Delete item from nComplContainer
  nComplContainer.removeChild(itemEl);

  // Render markup
  renderTodo(item);
};

const unmarkComplItem = function () {};

const renderTodo = function (todo) {
  const html = generateItemMarkup(todo);

  if (!todo.status) nComplContainer.insertAdjacentHTML("afterbegin", html);

  if (todo.status) complContainer.insertAdjacentHTML("afterbegin", html);
};

const renderLocalStorage = function () {
  // Get localStorage
  const data = JSON.parse(localStorage.getItem("todos"));

  if (!data) return;

  state.todos = data;

  state.todos.forEach(todo => renderTodo(todo));
  // state.todos.push(data);
};

/**
 *
 * @param {Array} todo
 * @returns {string}
 */
const generateItemMarkup = function (todo) {
  // If todo is not completed (status: 0)
  if (!todo.status) {
    return `
      <div class="todo__item" data-id="${todo.id}">
        <div class="todo__check"></div>
        <div class="todo__text">${todo.text}</div>
        <div class="todo__date">
          <span
            ><ion-icon
              class="todo__calendar-icon"
              name="calendar-outline"
            ></ion-icon></span
          >Due to today
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
    <div class="todo__date todo__date--completed">
      <span
        ><ion-icon
          class="todo__calendar-icon"
          name="calendar-outline"
        ></ion-icon></span
      >Due to today
    </div>
  </div>
  `;
};

const init = function () {
  renderLocalStorage();
  addItemFormEl.addEventListener("submit", addItem);

  nComplContainer.addEventListener("click", completedItem);

  // TODO
  complContainer.addEventListener("click", unmarkComplItem);
};

init();
