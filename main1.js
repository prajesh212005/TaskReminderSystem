// main1.js
import {
    addTask,
    sortTasksByPriority,
    displayTasksDueWithin,
    sendReminder,
    removeTask,
    taskList,
  } from "./script.js";
  
  document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.querySelector(".task-form");
    const taskListContainer = document.getElementById("taskList");
    const filterTimeInput = document.getElementById("filterTime");
    const filterTasksBtn = document.getElementById("filterTasksBtn");
    const taskNotification = document.getElementById("taskNotification");
    const addTaskBtn = document.getElementById("addTaskBtn");
  
    function displayTask(task) {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
              <div class="task-info">
                  <span class="task-title">${task.title}</span>
                  <span>Due in ${task.dueTime} minutes</span>
              </div>
              <span class="priority">Priority: ${task.priority}</span>
              <button class="remove-task-btn">Remove</button>
          `;
      taskListContainer.appendChild(taskItem);
  
      const removeButton = taskItem.querySelector(".remove-task-btn");
      removeButton.addEventListener("click", () => {
        if (removeTask(task)) {
          taskItem.remove();
        }
      });
      task.listItem = taskItem;
    }
  
    function displayNotification(message) {
      taskNotification.textContent = message;
      taskNotification.style.display = "block";
      setTimeout(() => {
        taskNotification.style.display = "none";
      }, 3000);
    }
  
    function renderTasks() {
      taskListContainer.innerHTML = "";
      taskList.forEach((task) => displayTask(task));
    }
  
    addTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const taskTitle = document.getElementById("taskTitle").value;
      const dueTime = document.getElementById("dueTime").value;
      const priority = document.getElementById("priority").value;
  
      try {
        const addedTask = addTask(taskTitle, dueTime, priority);
          displayTask(addedTask);
        sendReminder(addedTask, displayNotification)
          .then((completedTask) => {
            if (completedTask && completedTask.listItem) {
              displayNotification(`Task "${completedTask.title}" completed!`);
              if (removeTask(completedTask)) {
                completedTask.listItem.remove();
              }
            }
          })
          .catch((error) => console.log(error));
        // Clear input fields
        document.getElementById("taskTitle").value = "";
        document.getElementById("dueTime").value = "";
      } catch (error) {
        console.error(error);
      }
    });
  
      filterTasksBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const filterTime = parseInt(filterTimeInput.value);
          if (isNaN(filterTime) || filterTime <= 0) {
              displayNotification('Please enter a valid time in minutes.')
              return;
          }
        const tasksDue = displayTasksDueWithin(filterTime);
          taskListContainer.innerHTML = '';
          tasksDue.forEach(task => displayTask(task));
      });
    
    renderTasks();
  });