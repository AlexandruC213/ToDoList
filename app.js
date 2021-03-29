"use strict";

// Define UI
const taskTitle = document.querySelector("#taskTitle"),
  taskDescription = document.querySelector("#taskDescription"),
  filterTitleEl = document.querySelector("#filterTitle"),
  filterDescriptionEl = document.querySelector("#filterDescription"),
  form = document.querySelector(".form"),
  addTaskBtn = form.querySelector(".createTask"),
  deleteAllTasksBtn = form.querySelector(".deleteTasks"),
  switchModalBtn = form.querySelector(".switchModal"),
  containerItems = document.querySelector(".container-items");

let modal = false;

loadAllEvents();

// Load All Events Listeners
function loadAllEvents() {
  // Add task
  form.addEventListener("submit", addTask);

  // Check modal
  switchModalBtn.addEventListener("click", checkModalStatus);

  // Expand task
  containerItems.addEventListener("click", expandTask);

  // Complete task
  containerItems.addEventListener("click", completeTask);

  // Remove task
  containerItems.addEventListener("click", removeTask);

  // Remove ALL tasks
  deleteAllTasksBtn.addEventListener("click", deleteAllTasks);

  // Close Modal on ESC
  document.addEventListener("keydown", closeModalEsc);

  // Close Modal on click overlay
  containerItems.addEventListener("click", closeModalO);

  // Filter title
  filterTitleEl.addEventListener("keyup", filterByTitle);

  // Filter description
  filterDescriptionEl.addEventListener("keyup", filterByDescription);
}

// Add a task
function addTask(e) {
  // Get title and description values
  const title = taskTitle.value;
  const description = taskDescription.value;

  // check if there is a title and description
  if (title.trim() !== "" && description.trim() !== "") {
    // Get Time
    const currentTime = getTime();

    // Create Element
    const taskEl = createElement(title, description, currentTime);

    // Append to UI
    containerItems.insertAdjacentHTML("beforeend", taskEl);

    // Clear inputs
    clearInputs();
  } else {
    alert("Please insert Title and Description!");
  }

  e.preventDefault();
}

// CheckModalStatus
function checkModalStatus() {
  if (switchModalBtn.value === "Modal OFF") {
    switchModalBtn.value = "Modal ON";
    modal = true;
    containerItems.removeEventListener("click", expandTask);
    containerItems.addEventListener("click", toggleModal);
  } else {
    switchModalBtn.value = "Modal OFF";
    modal = false;
    containerItems.removeEventListener("click", toggleModal);
    containerItems.addEventListener("click", expandTask);
  }
}

// Toggle Modal
function toggleModal(e) {
  const elementClasses = e.target.classList;
  if (elementClasses.contains("active")) {
    alert("Switch back and close the task!");
  } else if (elementClasses.contains("expand-content")) {
    // Select all items
    const btn = e.target;
    const content = btn.nextElementSibling;
    const overlay = content.nextElementSibling;
    const btnCloseModal = content.firstElementChild;

    // Implement the switch
    content.classList.replace("content-task", "myModal");
    overlay.classList.remove("hidden");
    btnCloseModal.classList.remove("hidden");

    // Add event to close the Modal
    btnCloseModal.addEventListener("click", function () {
      content.classList.replace("myModal", "content-task");
      overlay.classList.add("hidden");
      btnCloseModal.classList.add("hidden");
    });
  }
}

// Expand Tasks
function expandTask(e) {
  if (e.target.classList.contains("expand-content")) {
    const btn = e.target;
    const icon = btn.lastElementChild;

    icon.classList.toggle("fa-plus-circle");
    icon.classList.toggle("fa-minus-circle");

    btn.classList.toggle("active");
    const content = btn.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight * 2 + "px";
    }
  }
}

// Complete Task
function completeTask(e) {
  if (e.target.classList.contains("complete-task")) {
    const task = e.target.closest(".task").firstElementChild;
    task.classList.add("complete");
  }
}

// Remove Task
function removeTask(e) {
  if (e.target.classList.contains("delete-task")) {
    e.target.closest(".task").remove();
  }
}

// Delete All Tasks
function deleteAllTasks() {
  containerItems.textContent = "";
}

// Close Modal on ESC
function closeModalEsc(e) {
  if (e.key === "Escape") {
    closeModal();
  }
}

// Close Modal on click overlay
function closeModalO(e) {
  if (e.target.classList.contains("overlay")) {
    closeModal();
  }
}

// Filter task
function filterByTitle(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll(".task").forEach(function (task) {
    const item = task.firstElementChild.textContent.toLowerCase();
    filterTask(item, text, task);
  });
}

// Filter task by description
function filterByDescription(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll(".task").forEach(function (task) {
    const item = task
      .querySelector("div")
      .querySelector("p")
      .textContent.toLowerCase();
    filterTask(item, text, task);
  });
}

function filterTask(item, text, task) {
  if (item.indexOf(text) !== -1) {
    task.style.display = "block";
  } else {
    task.style.display = "none";
  }
}

function createElement(title, desc, time) {
  return `<div class="task">
    <button class="expand-content">${title}<i class="fas fa-plus-circle"></i></button>
    <div class="content-task">
        <button class="closeModal hidden">&#10005;</button>
        <p>${desc}</p>
        <p>Created at ${time}</p>
        <div class="controls-task">
            <button class="complete-task">Completed</button>
            <button class="delete-task">Delete</button>
        </div>
    </div>
    <div class="overlay hidden"></div>
  </div>`;
}

function getTime() {
  let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
  let [hour, minute, second] = new Date()
    .toLocaleTimeString("en-US")
    .split(/:| /);
  const time = `${hour}:${minute}:${second}  ${date}/${month}/${year}`;
  return time;
}

function clearInputs() {
  taskTitle.value = "";
  taskDescription.value = "";
}

function closeModal() {
  document.querySelectorAll(".task").forEach(function (item) {
    const content = item.querySelector(".myModal");
    const overlay = item.querySelector(".overlay");
    const btnCloseModal = item.querySelector(".closeModal");
    if (content && overlay && btnCloseModal) {
      content.classList.replace("myModal", "content-task");
      overlay.classList.add("hidden");
      btnCloseModal.classList.add("hidden");
    }
  });
}
