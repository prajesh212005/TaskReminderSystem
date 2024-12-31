// script.js

const taskList = [];

function addTask(title, dueTime, priority) {
  try {
    if (!title || !dueTime || !priority) {
      throw new Error("Task title, due time, and priority are required.");
    }

    const parsedDueTime = parseInt(dueTime, 10);
    if (isNaN(parsedDueTime) || parsedDueTime < 0) {
      throw new Error("Due time must be a non-negative number.");
    }


    const newTask = {
      title: title,
      dueTime: parsedDueTime,
      priority: priority,
      completed: false
    };
    taskList.push(newTask);
    return newTask;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

function sortTasksByPriority() {
  const priorityOrder = {High: 1, Medium: 2, Low: 3};
  taskList.sort((a,b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}


function displayTasksDueWithin(timeframe) {
  const now = Date.now();
  const tasksToShow = taskList.filter(task => {
      const taskDueDate = now + (task.dueTime * 60 * 1000); // Convert minutes to ms
      const targetTime = now + (timeframe * 60 * 1000) //timeframe in ms
    return taskDueDate <= targetTime;
  });
  return tasksToShow;
}


function sendReminder(task, displayNotification) {
  return new Promise((resolve, reject) => {
    const delay = task.dueTime * 60 * 1000;
     setTimeout(() => {
      if (!task.completed) {
        displayNotification(`Task "${task.title}" is due!`);
        task.completed = true;
        resolve(task);
      } else {
          reject("Task already completed")
      }

    }, delay);
  });
}


function removeTask(taskToRemove) {
    const index = taskList.findIndex(task => task === taskToRemove);
    if (index > -1) {
      taskList.splice(index, 1);
        return true; //return value
    }
    return false;
}

export { addTask, sortTasksByPriority, displayTasksDueWithin, sendReminder, removeTask, taskList };