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
    renderToDoTask(filteredTasks);
    renderInProgressTask(filteredTasks);
    renderAwaitFeedbackTask(filteredTasks);
    renderDoneTask(filteredTasks);
    generateEmtyTaskFormHTML();
}


/**
 * Renders the "To Do" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the toDo Tasks.
 */
async function renderToDoTask(loadedTasks) {    
    let open = loadedTasks.filter(t => t['status'] == 'toDo');
    let container = document.getElementById('todoListContainer');
    container.innerHTML = '';
    
    if (open.length > 0) {
        for (let index = 0; index < open.length; index++) {
            let element = open[index];
            let elementID = open[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}


/**
 * Renders the "In Progress" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the inProgress Tasks.
 */
function renderInProgressTask(loadedTasks){
    let inProgress = loadedTasks.filter(t => t['status'] == 'inProgress');
    let container = document.getElementById('progressListContainer');
    container.innerHTML = '';   

    if (inProgress.length > 0) {
        for (let index = 0; index < inProgress.length; index++) {
            let element = inProgress[index];
            let elementID = inProgress[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}


/**
 * Renders the "Await Feedback" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the aweitFeedback Tasks.
 */
function renderAwaitFeedbackTask(loadedTasks){
    let awaitFeedback = loadedTasks.filter(t => t['status'] == 'aweitFeedback');
    let container = document.getElementById('awaitFeedbackListContainer');
    container.innerHTML = '';

    if (awaitFeedback.length > 0) {
        for (let index = 0; index < awaitFeedback.length; index++) {
            let element = awaitFeedback[index];
            let elementID = awaitFeedback[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
            }
    } else {
        generateEmtyTodoHTML(container);
    }
}


/**
 * Renders the "Done" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the done Tasks.
 */
function renderDoneTask(loadedTasks){
    let done = loadedTasks.filter(t => t['status'] == 'done');
    let container = document.getElementById('doneListContainer');
    container.innerHTML = '';

    if (done.length > 0) {
        for (let index = 0; index < done.length; index++) {
            let element = done[index];
            let elementID = done[index].taskID;
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
    assignedContactsContainer.innerHTML = '';
    
    if (element[0].assignedContact.length > 0) {
        let assignedTO = document.getElementById('assignedTO');
        assignedTO.innerHTML = 'Assigned To:';
        for (let i = 0; i < element[0].assignedContact.length; i++) {
            const contact = element[0].assignedContact[i].name;
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
    if (element[0].subtask.length > 0) {
        let Subtasks = document.getElementById('Subtasks');
        Subtasks.innerHTML = 'Subtasks:';

        for (let i = 0; i < element[0].subtask.length; i++) {
            const subtask = element[0].subtask[i];
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
    const taskIndex = allTasks.findIndex(task => task.taskID === elementID);
    if (taskIndex !== -1 && subtaskIndex < allTasks[taskIndex].subtask.length) {
        const currentStatus = allTasks[taskIndex].subtask[subtaskIndex].status;
        const newStatus = currentStatus === 'open' ? 'done' : 'open';

        allTasks[taskIndex].subtask[subtaskIndex].status = newStatus;
        allTasks[taskIndex].subtask[subtaskIndex].isChecked = newStatus === 'done' || false; 
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
    currentDraggedElement['status'] = category;
    currentDraggedElement['taskID'] = new Date().getTime();

    await allTasks.push(currentDraggedElement);
    await setItem('allTasks', JSON.stringify(allTasks))
    await updateHTML();
    await deleteTask(currentDraggedElementID);
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
    let element = loadedTasks.filter(id => id['taskID'] == elementID);
    let infoCard = document.getElementById('InfoCard');   
    
    infoCard.innerHTML = generateOpenInfoCardHTML(element, elementID);

    renderAssignedContactsInfoCard(element, elementID);
    renderSubtasksInfoCard(element, elementID);
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


// generateHTML



/**
 * Generates the HTML for an open information card.
 * @param {Array} element - The element containing task information.
 * @param {number} elementID - The ID of the element.
 * @returns {string} - The HTML for the information card.
 */
function generateOpenInfoCardHTML(element, elementID){
    const reversedDate = reverseDate(element[0].date);
    const categoryHTML = element[0]['category'] ? `<div class="category">${getFirstLettersUppercase(element[0]['category'])}</div>` : '';

    return /*html*/`
    <div class="popup editTaskContainerBoard" onclick="closeTaskPopup()">
        <div class="popup-content editTask" onclick="doNotClose(event)">
            <div class="spacebetween pointer">
                ${categoryHTML}                
                <div onclick="closeTaskPopup()">
                    <img src="assets/img/close.png" alt="">
                </div>
            </div>
            
            <h1 class="popupTaskTitel">${element[0].title}</h1>                
            <p class="popupTaskDescription">${element[0].description}</p>         
            <table>
                <tbody>
                    <tr class="tableRaw">
                        <td class="popupTaskInfoTitel">Due date:</td>   
                        <td class="popupTaskInfoTitel">Priority:</td>
                    </tr>
                    <tr class="tableRaw">
                        <td class="popupTaskDescription">${reversedDate}</td>    
                        <td class="popupTaskDescription">${element[0].priority} ${selectedTaskInnerHTML(element[0]['priority'])}</td>
                    </tr>
                </tbody>
            </table>
            <div id="selectContact" class="selectContactPopup">                
                <p id="assignedTO" class="popupTaskInfoTitel"></p>
                <div id="assignedContactsContainer" class="assignedSubtasksContainer">
                </div>
            </div>
            <div id="selectContact" class="selectContactPopup">
                <p id="Subtasks" class="popupTaskInfoTitel"></p>
                <div id="assignedSubtasksContainer" class="assignedSubtasksContainer">
                </div>
            </div>

            <div class="editButtonContainer">
                <div class="editButton" onclick="deleteTask(${elementID})">
                    <img src="assets/img/delete.png" alt="">
                    <p>Delete </p> 
                </div> 
                <p>|</p>
                <div class="editButton" onclick="editTask(${elementID})">
                    <img src="assets/img/edit.png" alt="">
                    <p>Edit</p>
                </div>
            </div>

        </div>
    </div>`;
}


/**
 * Opens the edit task form.
 * @param {Array} element - The element containing task information.
 * @param {number} elementID - The ID of the element.
 * @returns {string} - The HTML for the edit task form.
 */
function openEditTaskForm(element, elementID){
    const categoryHTML = element[0]['category'] ? `<div class="category">${getFirstLettersUppercase(element[0]['category'])}</div>` : '';
    saveStatus(element[0]['status']);

    return /*html*/`
    <div class="popup editTaskContainerBoard" onclick="closeTaskPopup()">
        <form class="popup-content editTask" onclick="doNotClose(event)" onsubmit="updateEditTask(${elementID}); return false;">
            <div class="editTask-container-content">
                <div class="spacebetween pointer">
                    ${categoryHTML}                
                    <div onclick="closeTaskPopup()">
                        <img src="assets/img/close.png" alt="">
                    </div>
                </div>
                <input required class="pointer" type="text" placeholder="Enter a title" id="add-task-title" value="${element[0].title}">

                <label for="add-task-description">Description (optional)</label>
                <textarea class="pointer" type="text" name="add-task-description" id="add-task-description"
                    placeholder="Enter a description">${element[0].description}</textarea>

                <label for="add-task-date">Due date</label>
                <input required class="pointer" type="date" name="add-task-date" id="add-task-date" min="" onclick="updateMinDate()">

                <label for="add-task-priority">Priority (optional)</label>
                <div id="add-task-priority">
                    <div id="add-task-urgent" class="add-task-priority-box pointer" onclick="changePriority('urgent')">
                        <div>Urgent</div>
                        <img src="/assets/img/Prio urgent.png" alt="">
                    </div>
                    <div id="add-task-medium" class="add-task-priority-box pointer" onclick="changePriority('medium')">
                        <div>Medium</div>
                        <img src="/assets/img/Prio medium.png" alt="">
                    </div>
                    <div id="add-task-low" class="add-task-priority-box pointer" onclick="changePriority('low')">
                        <div>Low</div>
                        <img src="/assets/img/Prio low.png" alt="">
                    </div>
                </div>

                <label for="add-task-assigne">Assgigned to (optional)</label>
                <div class="pointer" id="add-task-assigne" onclick="showAndHideContacts()">
                    <div>Select contacts to assgin</div>
                    <img src="/assets/img/arrow_drop_down.png" alt="">
                </div>
                <div class="d-none searchbar-add-contacts-input-container" id="searchbar-add-contacts-container">
                    <input onkeyup="searchContactToAdd()" class="pointer" type="text" id="searchbar-add-contacts">
                    <img class="rotated-image" src="/assets/img/arrow_drop_down.png" alt="" onclick="showAndHideContacts()"> <!-- reverse so that the arrow points upwards-->
                </div>
                <div class="d-none" id="add-task-contacts-to-assigne">
                </div>
                <div class="d-none" id="add-task-selected-contacts-mini">
                </div>

                <label for="add-task-category">Category</label>
                <div class="pointer" id="add-task-category" onclick="showAndHideCategories()">
                    <div id="add-task-currently-selected-category">Select task category</div>
                    <img id="arrow-categories" src="/assets/img/arrow_drop_down.png" alt="">
                </div>
                <div class="d-none" id="add-task-category-dropdown">
                    <div class="add-task-category-dropdown-task" onclick="selectedTask('technical-task')">Technical Task
                    </div>
                    <div class="add-task-category-dropdown-task" onclick="selectedTask('user-story')">User Story</div>
                </div>

                <label for="add-task-subtask">Subtask (optional)</label>
                <div id="add-task-subtask-container">
                    <div id="add-task-subtask-input-container">
                        <input class="pointer" type="text" name="subtask" id="add-task-subtask-input"
                            placeholder="Add new subtask">

                        <div id="add-task-subtask-image-container">
                            <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="addSubtask()">
                        </div>
                    </div>
                    <div>
                        <ul id="add-task-subtask-list">
                        </ul>
                    </div>
                </div>

                <div class="add-task-form-buttons editTaskButton">
                    <button type="button" id="add-task-clear-form" onclick="clearForm()" formnovalidate>Clear X</button>
                    <button id="add-task-create-task" onclick="closeAddTaskForm()"> Create Task <img src="/assets/img/check.png" alt=""></button>            
                </div>
            </div>           
        </form>
    </div>`;
} 


/**
 * Generates the HTML for an empty task form.
 */
function generateEmtyTaskFormHTML(){
    let taskForm = document.getElementById('task-form');

    taskForm.innerHTML = /*html*/`
    <div class="add-task-container">
    <form onsubmit="updateCreatedTask(); return false;">
        <div class="add-task-container-content">
            <input required class="pointer" type="text" placeholder="Enter a title" id="add-task-title">

            <label for="add-task-description">Description (optional)</label>
            <textarea class="pointer" type="text" name="add-task-description" id="add-task-description"
                placeholder="Enter a description"></textarea>

            <label for="add-task-date">Due date</label>
            <input required class="pointer" type="date" name="add-task-date" id="add-task-date" min="" onclick="updateMinDate()">

            <label for="add-task-priority">Priority (optional)</label>
            <div id="add-task-priority">
                <div id="add-task-urgent" class="add-task-priority-box pointer" onclick="changePriority('urgent')">
                    <div>Urgent</div>
                    <img src="/assets/img/Prio urgent.png" alt="">
                </div>
                <div id="add-task-medium" class="add-task-priority-box pointer" onclick="changePriority('medium')">
                    <div>Medium</div>
                    <img src="/assets/img/Prio medium.png" alt="">
                </div>
                <div id="add-task-low" class="add-task-priority-box pointer" onclick="changePriority('low')">
                    <div>Low</div>
                    <img src="/assets/img/Prio low.png" alt="">
                </div>
            </div>

            <label for="add-task-assigne">Assgigned to (optional)</label>
            <div class="pointer" id="add-task-assigne" onclick="showAndHideContacts()">
                <div>Select contacts to assgin</div>
                <img src="/assets/img/arrow_drop_down.png" alt="">
            </div>
            <div class="d-none searchbar-add-contacts-input-container" id="searchbar-add-contacts-container">
                <input onkeyup="searchContactToAdd()" class="pointer" type="text" id="searchbar-add-contacts">
                <img class="rotated-image" src="/assets/img/arrow_drop_down.png" alt="" onclick="showAndHideContacts()"> <!-- reverse so that the arrow points upwards-->
            </div>
            <div class="d-none" id="add-task-contacts-to-assigne">
            </div>
            <div class="d-none" id="add-task-selected-contacts-mini">
            </div>            
            
            <label for="add-task-category">Category</label>
            <div class="pointer" id="add-task-category" onclick="showAndHideCategories()">
                <div id="add-task-currently-selected-category">Select task category</div>
                <img id="arrow-categories" src="/assets/img/arrow_drop_down.png" alt="">
            </div>
            <div class="d-none" id="add-task-category-dropdown">
                <div class="add-task-category-dropdown-task" onclick="selectedTask('technical-task')">Technical Task
                </div>
                <div class="add-task-category-dropdown-task" onclick="selectedTask('user-story')">User Story</div>
            </div>
        
            <label for="add-task-subtask">Subtask (optional)</label>
            <div id="add-task-subtask-container">
                <div id="add-task-subtask-input-container">
                    <input class="pointer" type="text" name="subtask" id="add-task-subtask-input"
                        placeholder="Add new subtask">

                    <div id="add-task-subtask-image-container">
                        <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="addSubtask()">
                    </div>
                </div>
                <div>
                    <ul id="add-task-subtask-list">                        
                    </ul>
                </div>
            </div>
            <div class="add-task-form-buttons">
                <button type="button" id="add-task-clear-form" onclick="clearForm()" formnovalidate>Clear X</button>
                <button id="add-task-create-task" onclick="closeAddTaskForm()"> Create Task <img src="/assets/img/check.png" alt=""></button>
            </div>
        </div>       
</div>`;
}

