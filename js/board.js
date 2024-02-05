let loadedTasks = [];
let currentDraggedElement;
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


// renders the different tasks
async function renderToDoTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "toDo", "todoListContainer");
  } 
function renderInProgressTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "inProgress", "progressListContainer");
}
function renderAwaitFeedbackTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "awaitFeedback", "awaitFeedbackListContainer");
}
function renderDoneTask(loadedTasks) {
    renderTasksByStatus(loadedTasks, "done", "doneListContainer");
}
  

//renders tasks by their different status
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
    const categoryHTML = element['category'] ? `<div class="category">${getFirstLettersUppercase(element['category'])}</div>` : '';

    const dropdownMenuHTML = /*html*/`
    <select class="statusDropdown" id="statusDropdown${elementID}" onchange="updateStatusMobile(${elementID}, this.value)">
            <option value="" disabled selected>Status</option>
            <option value="toDo" ${element.status === 'toDo' ? 'disabled' : ''}>To do</option>
            <option value="inProgress" ${element.status === 'inProgress' ? 'disabled' : ''}>In progress</option>
            <option value="awaitFeedback" ${element.status === 'awaitFeedback' ? 'disabled' : ''}>Await feedback</option>
            <option value="done" ${element.status === 'done' ? 'disabled' : ''}>Done</option>
    </select>
    `;

    return /*html*/`
    <div class="todo-container">
        <div draggable="true" onclick="openInfoCard(${elementID})" ondragstart="startDragging(${elementID})" class="todo" id="${elementID}">
            <div class="baseline"> 
                ${categoryHTML} 
                <div class="dropdown" onclick="doNotClose(event)">
                    ${dropdownMenuHTML}
                </div>
            </div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div class="progressBarContainer flex_spaceBetween" id="progressBarContainer">
                ${progressBarHTML}   
            </div>
            <div class="flex_spaceBetween">
                <div id="selectContact" class="selectContact">
                    ${assignedContactHTML}
                </div>
                <div class="priorityIcon">
                    ${selectedTaskPriorityInnerHTML(element['priority'])}
                </div>
            </div>           
        </div>
    </div>`;     
}


/**
 * Returns the category based on the priority.
 * @param {string} status - The priority for which the category needs to be determined.
 * @returns {string} - The corresponding category.
 */
function getStatusFromTask(status) {
    if (status === 'toDo') {
        return 'toDo';
    } else if (status === 'inProgress') {
        return 'inProgress';
    } else if (status === 'awaitFeedback') {
        return 'awaitFeedback';
    } else if (status === 'done') {
        return 'done';
    } else {        
        return 'DefaultCategory';
    }
}


/**
 * Updates the priority of an element and executes the moveTo function.
 * @param {number} elementID - The ID of the element whose priority is to be updated.
 * @param {string} status - The new priority of the element.
 */
async function updateStatusMobile(elementID, status) {
    dragElement = loadedTasks.filter(id => id['taskID'] == elementID);
    currentDraggedElement = dragElement[0];
    currentDraggedElementID = dragElement[0].taskID;

    const category = getStatusFromTask(status);
    await moveTo(category);
}


/**
 * Generates HTML for a small progress bar based on open subtasks.
 * @param {Array} element - The element containing task information.
 * @returns {string} - The HTML for the progress bar.
 */
function progressBarSmallInfoCard(element) {
    if (element.subtask.length > 0) {
        const openSubtasksCount = countOpenSubtasks(element);
        const progressPercentage = Math.round((openSubtasksCount / element.subtask.length) * 100);
        const subTaskCountContainerStyle = element.subtask.length === 0 ? 'display: none;' : '';
        const progressBarHTML = `
            <div class="progressBar">
                <div class="progressBarFill" style="width: ${progressPercentage}%;"></div>
            </div>
            <div id="subTaskCount" style="${subTaskCountContainerStyle}">
                ${openSubtasksCount}/${element.subtask.length} Subtasks
            </div>`;
        
        return progressBarHTML;
    } else {        
        return '';
    }
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
 * Opens the information card for a specific task.
 * @param {number} elementID - The ID of the element.
 */
function openInfoCard(elementID){    
    closeAddTaskForm();

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
 * Updates the edited task.
 * @param {number} elementID - The ID of the element being edited.
 */
async function updateEditedTask(elementID){
    const title = document.getElementById('add-task-title').value;
    const description = document.getElementById('add-task-description').value;
    const date = document.getElementById('add-task-date').value;
    const priority = assignPriority(selectedPriority);
    const assignedContact = selectedContacts;
    const category = selectedCategory;
    const subtask = subtasks;

    const taskIndex = allTasks.findIndex(task => task.taskID === elementID);
    if (taskIndex === -1) {
        return;
    }

    const currentAssignedContacts = allTasks[taskIndex].assignedContact;
    const combinedAssignedContacts = [...currentAssignedContacts, ...assignedContact];
    const uniqueAssignedContacts = [...new Set(combinedAssignedContacts)];


    allTasks[taskIndex].title = title;
    allTasks[taskIndex].description = description;
    allTasks[taskIndex].date = date;
    allTasks[taskIndex].priority = priority;
    allTasks[taskIndex].assignedContact = uniqueAssignedContacts;
    allTasks[taskIndex].category = category;
    allTasks[taskIndex].subtask = subtask.slice();

    setItem('allTasks', JSON.stringify(allTasks));
    renderAssignableContactsEdit(elementID);
    
    await updateHTML();
    location.reload();
}


// function updateAssignedContacts(elementID){

//     const assignedContact = selectedContacts;
//     const taskIndex = allTasks.findIndex(task => task.taskID === elementID);
//     if (taskIndex === -1) {
//         return;
//     }
//     // if (assignedContact = allTasks[taskIndex].assignedContact){
//         console.log(allTasks[taskIndex].assignedContact);
//     // }
//     const combinedAssignedContacts = [...allTasks[taskIndex].assignedContact, ...assignedContact];
//     const uniqueAssignedContacts = [...new Set(combinedAssignedContacts)];

//     allTasks[taskIndex].assignedContact = uniqueAssignedContacts;
    
//     setItem('allTasks', JSON.stringify(allTasks));
//     renderAssignableContactsEdit(elementID);
// }
function selectAssignedContact(elementID, index){
    let contact = document.getElementById(`contact-${index}`);
    const assignedContact = selectedContacts;
    const taskIndex = allTasks.findIndex(task => task.taskID === elementID);
    if (taskIndex === -1) {
        return;
    }
    if (contact.classList.contains('selectedContact')) {
        const combinedAssignedContacts = [...allTasks[taskIndex].assignedContact, ...assignedContact];
        const uniqueAssignedContacts = [...new Set(combinedAssignedContacts)];

        allTasks[taskIndex].assignedContact = uniqueAssignedContacts;
    } 
    else {
        const existingContactIndex = allTasks[taskIndex].assignedContact.indexOf(assignedContact);
        allTasks[taskIndex].assignedContact.splice(existingContactIndex, 1);
    }  
    
    setItem('allTasks', JSON.stringify(allTasks));
    renderAssignableContactsEdit(elementID);
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
    const subtaskE = allTasks.find(task => task.taskID === elementID);
    if (subtaskE) {
        subtasks = subtaskE.subtask || [];
        document.getElementById('add-task-subtask-list').innerHTML = renderSubtasksAddTask();
    }
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
// function filterTasksBySearch(tasks, searchInput) {
//     return tasks.filter(task =>
//         task.title.toLowerCase().includes(searchInput) ||
//         task.description.toLowerCase().includes(searchInput)
//     );
// }

function filterTasksBySearch(tasks, searchInput) {
    return tasks.filter(task =>
        (task.title && task.title.toLowerCase().includes(searchInput)) ||
        (task.description && task.description.toLowerCase().includes(searchInput))
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