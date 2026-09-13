// ==============================
// TaskFlow - To-Do Web App
// ==============================

// DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");


// Store tasks
let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];


// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


// Create a unique ID
function createTaskId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}


// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);

    return date.toLocaleString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// Add a new task
function addTask(taskText) {

    const text = taskText.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: createTaskId(),
        text: text,
        completed: false,
        createdAt: Date.now(),
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// Toggle task completion
function toggleTask(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    if (task.completed) {
        task.completedAt = Date.now();
    } else {
        task.completedAt = null;
    }

    saveTasks();
    renderTasks();
}


// Delete a task
function deleteTask(taskId) {

    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    renderTasks();
}


// Edit a task
function editTask(taskId) {

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    const taskItem = document.querySelector(
        `.task-item[data-id="${taskId}"]`
    );

    if (!taskItem) {
        return;
    }

    const content = taskItem.querySelector(".task-content");
    const actions = taskItem.querySelector(".task-actions");

    content.innerHTML = "";

    const editInput = document.createElement("input");

    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.text;
    editInput.maxLength = 120;

    content.appendChild(editInput);

    actions.innerHTML = "";

    const saveButton = document.createElement("button");

    saveButton.type = "button";
    saveButton.className = "save-button";
    saveButton.textContent = "Save";

    const cancelButton = document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className = "cancel-button";
    cancelButton.textContent = "Cancel";

    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);

    editInput.focus();
    editInput.select();


    // Save edited task
    saveButton.addEventListener("click", () => {

        const updatedText = editInput.value.trim();

        if (updatedText === "") {
            editInput.focus();
            return;
        }

        task.text = updatedText;

        saveTasks();
        renderTasks();
    });


    // Cancel editing
    cancelButton.addEventListener("click", () => {
        renderTasks();
    });


    // Save with Enter
    editInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            saveButton.click();
        }

        if (event.key === "Escape") {
            cancelButton.click();
        }
    });
}


// Create a task card
function createTaskElement(task) {

    const taskItem = document.createElement("article");

    taskItem.className = "task-item";
    taskItem.dataset.id = task.id;


    // Complete button
    const checkButton = document.createElement("button");

    checkButton.type = "button";
    checkButton.className = "task-check";

    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as pending"
            : "Mark task as complete"
    );


    // Task content
    const content = document.createElement("div");

    content.className = "task-content";


    const taskText = document.createElement("p");

    taskText.className = "task-text";
    taskText.textContent = task.text;


    const taskTime = document.createElement("p");

    taskTime.className = "task-time";

    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Added ${formatTime(task.createdAt)} · Completed ${formatTime(task.completedAt)}`;

    } else {

        taskTime.textContent =
            `Added ${formatTime(task.createdAt)}`;
    }


    content.appendChild(taskText);
    content.appendChild(taskTime);


    // Action buttons
    const actions = document.createElement("div");

    actions.className = "task-actions";


    const editButton = document.createElement("button");

    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";


    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";


    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    // Assemble task
    taskItem.appendChild(checkButton);
    taskItem.appendChild(content);
    taskItem.appendChild(actions);


    // Event listeners
    checkButton.addEventListener("click", () => {
        toggleTask(task.id);
    });

    editButton.addEventListener("click", () => {
        editTask(task.id);
    });

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });


    return taskItem;
}


// Display empty state
function createEmptyState(message, icon) {

    const emptyState = document.createElement("div");

    emptyState.className = "empty-state";

    const emptyIcon = document.createElement("div");

    emptyIcon.className = "empty-icon";
    emptyIcon.textContent = icon;

    const messageText = document.createElement("p");

    messageText.innerHTML = message;


    emptyState.appendChild(emptyIcon);
    emptyState.appendChild(messageText);

    return emptyState;
}


// Render all tasks
function renderTasks() {

    pendingList.innerHTML = "";
    completedList.innerHTML = "";


    const pendingTasks = tasks.filter(task => !task.completed);

    const completedTasks = tasks.filter(task => task.completed);


    // Update counts
    pendingCount.textContent =
        `${pendingTasks.length} ${pendingTasks.length === 1 ? "pending" : "pending"}`;

    completedCount.textContent =
        `${completedTasks.length} ${completedTasks.length === 1 ? "completed" : "completed"}`;


    // Pending empty state
    if (pendingTasks.length === 0) {

        pendingList.appendChild(
            createEmptyState(
                "No pending tasks yet.<br>Add something you'd like to accomplish.",
                "✓"
            )
        );

    } else {

        pendingTasks.forEach(task => {
            pendingList.appendChild(createTaskElement(task));
        });
    }


    // Completed empty state
    if (completedTasks.length === 0) {

        completedList.appendChild(
            createEmptyState(
                "Nothing completed yet.<br>Your finished tasks will appear here.",
                "★"
            )
        );

    } else {

        completedTasks.forEach(task => {
            completedList.appendChild(createTaskElement(task));
        });
    }
}


// Form submit event
taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    addTask(taskInput.value);
});


// Initial render
renderTasks();