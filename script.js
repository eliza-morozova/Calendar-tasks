const today = new Date();
let selectedDate = new Date(today);
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const monthEl = document.getElementById("month");
const daysEl = document.getElementById("days");
const taskDateEl = document.getElementById("task-date");
const taskListEl = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

function getDateKey(date) {
  return date.toISOString().split("T")[0];
}

function renderCalendar() {
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  monthEl.textContent = new Date(currentYear, currentMonth)
    .toLocaleString("en-US", { month: "long", year: "numeric" });

  daysEl.innerHTML = "";
  const startIndex = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < startIndex; i++) {
    daysEl.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(currentYear, currentMonth, d);
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = d;

    if (day.toDateString() === today.toDateString()) div.classList.add("today");
    if (day.toDateString() === selectedDate.toDateString()) div.classList.add("selected");

    const key = getDateKey(day);
    if (tasks[key]?.length) {
      const span = document.createElement("span");
      span.className = "task-count";
      span.textContent = tasks[key].length;
      div.appendChild(span);
    }

    div.onclick = () => {
      selectedDate = day;
      renderCalendar();
      renderTasks();
    };

    daysEl.appendChild(div);
  }
}

function renderTasks() {
  const key = getDateKey(selectedDate);
  taskDateEl.textContent = "Tasks for " + selectedDate.toDateString();
  taskListEl.innerHTML = "";

  if (!tasks[key] || tasks[key].length === 0) {
    taskListEl.innerHTML = `<p class="no-tasks">No tasks for this date yet</p>`;
    return;
  }

  tasks[key].forEach((task, index) => {
    const template = document.getElementById("task-template").firstElementChild.cloneNode(true);
    template.style.display = "flex";
    template.querySelector(".task-text").textContent = task;
    template.querySelector(".delete-btn").onclick = () => removeTask(key, index);
    taskListEl.appendChild(template);
  });
}

function addTask() {
  const value = taskInput.value.trim();
  if (!value) return;

  const key = getDateKey(selectedDate);
  if (!tasks[key]) tasks[key] = [];
  tasks[key].push(value);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderCalendar();
  renderTasks();
}

function removeTask(dateKey, taskIndex) {
  tasks[dateKey].splice(taskIndex, 1);
  if (tasks[dateKey].length === 0) delete tasks[dateKey];

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderCalendar();
  renderTasks();
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
}

renderCalendar();
renderTasks();
