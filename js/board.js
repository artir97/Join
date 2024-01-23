/**
 * Array to store loaded tasks.
 * @type {Array}
 */
let loadedTasks= [];


/**
 * Variable to store the currently dragged element.
 * @type {HTMLElement}
 */
let currentDraggedElement;


/**
 * Variable to store the ID of the currently dragged element.
 * @type {number}
 */
let currentDraggedElementID; 


/**
 * Saves the status of an element.
 * @param {string} Elementstatus - The status to be saved.
 */
function saveStatus(Elementstatus){
    lastStatus = Elementstatus
};


/**
 * Loads tasks from storage to the board asynchronously.
 */
async function loadedTaskstoBoard() {
    const loadTasks = await getItem('allTasks');
    loadedTasks = JSON.parse(loadTasks);
}


/**
 * Updates the HTML content of the board.
 * @async
 */
async function updateHTML() {
    await loadedTaskstoBoard();
    const searchInput = document.getElementById('findTask').value.toLowerCase();
    const filteredTasks = filterTasksBySearch(loadedTasks, searchInput);
    
    initTaskData();
    renderTasksByStatus(filteredTasks, "toDo", "todoListContainer");
    renderTasksByStatus(filteredTasks, "inProgress", "progressListContainer");
    renderTasksByStatus(filteredTasks, "awaitFeedback", "awaitFeedbackListContainer");
    renderTasksByStatus(filteredTasks, "done", "doneListContainer");
    generateEmtyTaskFormHTML();
}


async function renderToDoTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "toDo", "todoListContainer");
  }
  
  // Änderungen in der renderInProgressTask-Funktion
  function renderInProgressTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "inProgress", "progressListContainer");
  }
  
  // Änderungen in der renderAwaitFeedbackTask-Funktion
  function renderAwaitFeedbackTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "awaitFeedback", "awaitFeedbackListContainer");
  }
  
  // Änderungen in der renderDoneTask-Funktion
  function renderDoneTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "done", "doneListContainer");
  }
  
  // Neuer allgemeiner Status renderTasksByStatus
  function renderTasksByStatus(loadedTasks, status, containerId) {
    let tasks = loadedTasks.filter((t) => t["status"] === status);
    let container = document.getElementById(containerId);
    container.innerHTML = "";
  
    if (tasks.length > 0) {
      for (let index = 0; index < tasks.length; index++) {
        let element = tasks[index];
        let elementID = tasks[index].taskID;
        container.innerHTML += generateTodoHTML(element, elementID);
       
      }
    } else {
      generateEmtyTodoHTML(container);
    }
  }

/**
 * Generates the HTML for a tasks.
 * @param {Object} element - The task object.
 * @param {number} elementID - The ID of the task.
 * @returns {string} - The HTML representation of the task.
 */
function generateTodoHTML(element, elementID) {
    const assignedContactHTML = renderAssignedContactSmallInfoCard(element.assignedContact);
    const progressBarHTML = progressBarSmallInfoCard(element);
    const subTaskDone = filterSubTaskDone(element);
    const categoryHTML = element['category'] ? `<div class="category">${getFirstLettersUppercase(element['category'])}</div>` : '';

    return /*html*/`
        <div draggable="true" onclick="openInfoCard(${elementID})" ondragstart="startDragging(${elementID})" class="todo">
            ${categoryHTML}
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div class="progressBarContainer flex_spaceBetween">
                ${progressBarHTML}   <div>${subTaskDone}/${element.subtask.length} Subtasks</div>
            </div>
            <div class="flex_spaceBetween">
                <div id="selectContact" class="selectContact">
                    ${assignedContactHTML}
                </div>
                <div class="priorityIcon">
                    ${selectedTaskInnerHTML(element['priority'])}
                </div>
            </div>           
        </div>`;        
}


/**
 * Renders the assigned contacts information card. 
 * @param {Array} element - The element containing task information.
 */
function renderAssignedContactsInfoCard(element){
    let assignedContactsContainer = document.getElementById('assignedContactsContainer')
    // assignedContactsContainer.innerHTML = '';
    
    if (element.assignedContact.length > 0) {
        let assignedTO = document.getElementById('assignedTO');
        assignedTO.innerHTML = 'Assigned To:';
        for (let i = 0; i < element.assignedContact.length; i++) {
            const contact = element.assignedContact[i].name;
            assignedContactsContainer.innerHTML += /*html*/`
                <div class="singleContactPopup">
                    <div class="boardNameBox">${getInitials(contact)}</div>
                    <p>${contact}</p>
                </div>`;
        }
    }
  }


  /**
 * Renders the subtasks information card.
 * @param {Array} element - The element containing task information.
 * @param {number} elementID - The ID of the element.
 */
function renderSubtasksInfoCard(element, elementID) {
    let assignedSubtasksContainer = document.getElementById('assignedSubtasksContainer');
    assignedSubtasksContainer.innerHTML = '';

    let subtaskHTML = '';
    if (element.subtask.length > 0) {
        let Subtasks = document.getElementById('Subtasks');
        Subtasks.innerHTML = 'Subtasks:';

        for (let i = 0; i < element.subtask.length; i++) {
            const subtask = element.subtask[i];
            const checkboxId = `checkbox_${elementID}_${i}`; 
            const labelFor = `label_${elementID}_${i}`; 

            subtaskHTML += /*html*/`
                <div class="singleContactPopup">
                    <input type="checkbox" id="${checkboxId}" ${subtask.isChecked ? 'checked' : ''} onchange="toggleSubtaskStatus(${elementID}, ${i})">
                    <label for="${checkboxId}" id="${labelFor}"></label>
                    <p>${subtask.text}</p>
                </div>`;
        }
    }
    assignedSubtasksContainer.innerHTML = subtaskHTML;
}


/**
 * Toggles the status of a subtask. 
 * @param {number} elementID - The ID of the element.
 * @param {number} subtaskIndex - The index of the subtask.
 */
async function toggleSubtaskStatus(elementID, subtaskIndex) {
    const taskIndex = loadedTasks.findIndex((task) => task.taskID === elementID);
    if (taskIndex !== -1 && subtaskIndex < loadedTasks[taskIndex].subtask.length) {
      const currentStatus = loadedTasks[taskIndex].subtask[subtaskIndex].status;
      const newStatus = currentStatus === "open" ? "done" : "open";
  
      loadedTasks[taskIndex].subtask[subtaskIndex].status = newStatus;
      loadedTasks[taskIndex].subtask[subtaskIndex].isChecked = newStatus === "done" || false;
      await setItem("allTasks", JSON.stringify(loadedTasks));
      updateHTML();
    }
}

/**
 * Generates HTML for a small progress bar based on open subtasks.
 * @param {Array} element - The element containing task information.
 * @returns {string} - The HTML for the progress bar.
 */
function progressBarSmallInfoCard(element){
    const openSubtasksCount = countOpenSubtasks(element);
    const progressPercentage = openSubtasksCount > 0 ? Math.round((openSubtasksCount / element.subtask.length) * 100) : 0;
    const progressBarHTML = `
        <div class="progressBar">
            <div class="progressBarFill" style="width: ${progressPercentage}%;"></div>
        </div>`;

    return progressBarHTML;
}


/**
 * Renders assigned contacts as small info cards.
 * @param {Array} assignedContacts - The array of assigned contacts.
 * @returns {string} - The HTML for assigned contact small info cards.
 */
function renderAssignedContactSmallInfoCard(assignedContacts) {
    let assignedContactHTML = '';

    if (assignedContacts && assignedContacts.length > 0) {
        for (let i = 0; i < Math.min(assignedContacts.length, 3); i++) {
            let contact = assignedContacts[i];
            assignedContactHTML += `
                <div class="boardNameBox">
                    ${getInitials(contact.name)}
                </div>`;
        }

        if (assignedContacts.length > 3) {
            assignedContactHTML += `
                <div class="boardNameBoxExtra">
                    +${assignedContacts.length - 3}
                </div>`;
        }
    }
    return assignedContactHTML;
}


/**
 * Filters the number of subtasks that are done.
 * @param {Array} element - The element containing task information.
 * @returns {number} - The count of subtasks that are done.
 */
function filterSubTaskDone(element){
    let subTaskDone =  element.subtask.filter(subtask => subtask.status === 'done').length;

    return subTaskDone;
}


/**
 * Allows dropping of an element.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves a task to a specified category.
 * @param {string} category - The target category.
 */
async function moveTo(category) {
    currentDraggedElement["status"] = category;
    currentDraggedElement["taskID"] = new Date().getTime();
  
    loadedTasks.push(currentDraggedElement);
    await setItem("allTasks", JSON.stringify(loadedTasks));
    updateHTML();
    deleteTask(currentDraggedElementID);
}

/**
 * Initiates dragging of an element.
 * @param {number} elementID - The ID of the element being dragged.
 */
function startDragging(elementID) {
    dragElement = loadedTasks.filter(id => id['taskID'] == elementID);
    currentDraggedElement = dragElement[0];
    currentDraggedElementID = dragElement[0].taskID;
  }


  /**
 * Generates HTML for an empty todo task.
 * @param {HTMLElement} container - The container element.
 */
function generateEmtyTodoHTML(container){   
    container.innerHTML = /*html*/`               
    <div class="emtyTask">
       <p>No tasks To do</p>            
    </div>`;
}


/**
 * Opens the information card for a specific task.
 * @param {number} elementID - The ID of the element.
 */
function openInfoCard(elementID){    
    let element = loadedTasks.filter((id) => id["taskID"] == elementID);
    let infoCard = document.getElementById("InfoCard");
  
    infoCard.innerHTML = generateOpenInfoCardHTML(element, elementID);
  
    renderAssignedContactsInfoCard(element[0]);
    renderSubtasksInfoCard(element[0], elementID);
}


/**
 * Closes the add task form.
 */
async function closeAddTaskForm(){       
    document.getElementById('slide-form-add-task').style.display = 'none';    
}


/**
 * Opens the add task form.
 */
function openAddTaskForm(){
    document.getElementById('slide-form-add-task').style.display = 'block';
}


/**
 * Updates the created task.
 */
async function updateCreatedTask(){
    await createTask();
    await updateHTML();
}


/**
 * Updates the edited task.
 * @param {number} elementID - The ID of the element being edited.
 */
async function updateEditTask(elementID){
    await createTask();
    await deleteTask(elementID);
}


/**
 * Deletes a task.
 * @param {number} elementID - The ID of the element being deleted.
 */
async function deleteTask(elementID) {
    const index = allTasks.findIndex(task => task['taskID']  === elementID);  
   
    if (index !== -1) {
        allTasks.splice(index, 1);
        await setItem('allTasks', JSON.stringify(allTasks));
        
        closeTaskPopup();
        updateHTML();

    } else {
        alert('Task not found in the array');
    }
}


/**
 * Opens the edit task form for a specific task.
 * @param {number} elementID - The ID of the element being edited.
 */
function editTask(elementID){
    const element = allTasks.filter(task => task['taskID']  === elementID);
    let infoCard = document.getElementById('InfoCard');

    infoCard.innerHTML =  openEditTaskForm(element, elementID);
}


/**
 * Counts the number of open subtasks.
 * @param {Array} element - The element containing task information.
 * @returns {number} - The count of open subtasks.
 */
function countOpenSubtasks(element) {
    let subTaskDone =  element.subtask.filter(subtask => subtask.status === 'done').length;

    if (element.subtask && element.subtask.length > 0) {
        return subTaskDone
    } else {
        return 0;
    }
}


/**
 * Capitalizes the first letter of each word in a text.
 * @param {string} text - The input text.
 * @returns {string} - The text with first letters capitalized.
 */
function getFirstLettersUppercase(text) {
    if (!text) return '';
    return text.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}


/**
 * Gets the initials from a full name.
 * @param {string} fullName - The full name.
 * @returns {string} - The initials.
 */
function getInitials(fullName) {
    const nameParts = fullName.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials;
}


/**
 * Reverses the date format.
 * @param {string} originalDate - The original date.
 * @returns {string} - The reversed date.
 */
function reverseDate(originalDate) {
    const parts = originalDate.split('-');
    const reversedParts = parts.reverse();
    const reversedDate = reversedParts.join('/');
    return reversedDate;
}


/**
 * Searches for tasks.
 */
function searchTasks() {
    updateHTML();
}


/**
 * Filters tasks based on a search input.
 * @param {Array} tasks - The array of tasks.
 * @param {string} searchInput - The search input.
 * @returns {Array} - The filtered tasks.
 */
function filterTasksBySearch(tasks, searchInput) {
    return tasks.filter(task =>
        task.title.toLowerCase().includes(searchInput) ||
        task.description.toLowerCase().includes(searchInput)
    );
}


/**
 * Closes the task popup.
 */
function closeTaskPopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
    }
}


/**
 * Prevents closing of open infocard div.
 * @param {Event} event - The event.
 */
function doNotClose(event) {
    event.stopPropagation();
}


/**
 * Generates the inner HTML for a selected task.
 * @param {string} selectedTask - The selected task.
 * @returns {string} - The inner HTML.
 */
function selectedTaskInnerHTML(selectedTask) {    
    let taskImageSrc = '';

    switch (selectedTask) {
        case 'urgent':
            taskText = 'urgent';
            taskImageSrc = '/assets/img/Prio urgent.png';
            break;
        case 'medium':
            taskText = 'medium';
            taskImageSrc = '/assets/img/Prio medium.png';
            break;
        case 'low':
            taskText = 'low';
            taskImageSrc = '/assets/img/Prio low.png';
            break;
    }
    let resultHTML = `
        <img src="${taskImageSrc}" alt="${selectedTask}" class="priorityIcon">
    `;
    return resultHTML;
}