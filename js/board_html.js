// generateHTML



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
 * Generates the HTML for an open information card.
 * @param {Array} element - The element containing task information.
 * @param {number} elementID - The ID of the element.
 * @returns {string} - The HTML for the information card.
 */
function generateOpenInfoCardHTML(element, elementID) {
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
                        <td class="popupTaskDescription">${element[0].priority} ${selectedTaskPriorityInnerHTML(element[0]['priority'])}</td>
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
function openEditTaskForm(element, elementID) {
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
                <input required class="pointer" type="date" name="add-task-date" id="add-task-date" min="" value="${element[0].date}" onclick="updateMinDate()">

                <label for="add-task-priority">Priority (optional)</label>
                <div id="add-task-priority">
                    ${loadPriorityUrgent(element[0]['priority'])}
                    ${loadPriorityMedium(element[0]['priority'])}
                    ${loadPriorityLow(element[0]['priority'])}
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
                    <div id="add-task-currently-selected-category">${selectedTaskInnerHTML(element[0]['category'])}</div>
                    <img id="arrow-categories" src="/assets/img/arrow_drop_down.png" alt="">
                </div>
                <div class="d-none" id="add-task-category-dropdown">
                    <div class="add-task-category-dropdown-task" onclick="selectedTask('technical-task')">Technical Task
                    </div>
                    <div class="add-task-category-dropdown-task" onclick="selectedTask('user-story')">User Story</div>
                </div>
                <div class="d-none" id="add-task-category-alert">
                    <span>Please choose a category</span>
                </div>
                <label for="add-task-subtask">Subtask (optional)</label>
                <div id="add-task-subtask-container">
                    <div id="add-task-subtask-input-container">
                        <input class="pointer" type="text" name="subtask" id="add-task-subtask-input"
                            placeholder="Add new subtask">

                        <div id="add-task-subtask-image-container">
                            <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="confirmAddSubtask()">
                        </div>
                    </div>
                    <div class="d-none" id="add-task-subtask-alert">
                        <span style="color: red;">You can't add an empty subtask</span>
                    </div>
                    <div>
                        <ul id="add-task-subtask-list">                            
                        </ul>
                    </div>
                </div>

                <div class="add-task-form-buttons editTaskButton">
                    <button id="add-task-create-task" onclick="closeAddTaskForm()"> OK <img src="/assets/img/check.png" alt=""></button>            
                </div>
            </div>           
        </form>
    </div>`;
}


/**
 * Generates the HTML for an empty task form.
 */
function generateEmtyTaskFormHTML() {
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
            <div class="d-none" id="add-task-category-alert">
                <span>Please choose a category</span>
            </div>
            <label for="add-task-subtask">Subtask (optional)</label>
            <div id="add-task-subtask-container">
                <div id="add-task-subtask-input-container">
                    <input class="pointer" type="text" name="subtask" id="add-task-subtask-input"
                        placeholder="Add new subtask">

                    <div id="add-task-subtask-image-container">
                        <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="confirmAddSubtask()">
                    </div>
                </div>
                <div class="d-none" id="add-task-subtask-alert">
                    <span style="color: red;">You can't add an empty subtask</span>
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


/**
 * Generates the inner HTML for a selected task.
 * @param {string} selectedTask - The selected task.
 * @returns {string} - The inner HTML.
 */
function selectedTaskPriorityInnerHTML(selectedTask) {    
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
        default: 
            taskText = 'no priority'
            taskImageSrc = '/assets/img/white-block.png';
    }
    let resultHTML = `
        <img src="${taskImageSrc}" alt="${selectedTask}" class="priorityIcon">
    `;
    return resultHTML;
}


function loadPriorityLow(priority){
    
    switch(priority){
        case 'low':
           return (
            `
            <div id="add-task-low" class="add-task-priority-box pointer selected" onclick="changePriority('low')" style="background-color: rgb(122, 226, 41); color: rgb(255, 255, 255);">
                <div>Low</div>                    
                <img src="/assets/img/Prio low white.png" alt="">
            </div>
            `
           );
        default:
            return (
                `
                <div id="add-task-low" class="add-task-priority-box pointer" onclick="changePriority('low')">
                    <div>Low</div>
                    <img src="/assets/img/Prio low.png" alt="">
                </div>
                `
            );
    }
}

function loadPriorityMedium(priority){
    switch(priority){
        case 'medium':
            return (
                `
                <div id="add-task-medium" class="add-task-priority-box pointer selected" onclick="changePriority('medium')" style="background-color: rgb(255, 168, 0); color: rgb(255, 255, 255);">
                    <div>Medium</div>
                    <img src="/assets/img/Prio medium white.png" alt="">
                 </div>
                `
            );
        default: 
            return (
                `
                <div id="add-task-medium" class="add-task-priority-box pointer" onclick="changePriority('medium')">
                    <div>Medium</div>
                    <img src="/assets/img/Prio medium.png" alt="">
                </div>
                `
            );
    }
}

function loadPriorityUrgent(priority){
    switch(priority){
        case 'urgent':
            return (
                `
                <div id="add-task-urgent" class="add-task-priority-box pointer selected" onclick="changePriority('urgent')" style="background-color: rgb(255, 61, 0); color: rgb(255, 255, 255);">
                    <div>Urgent</div>
                    <img src="/assets/img/Prio urgent white.png" alt="">
                </div>
                `
            );
        default: 
            return (
                `
                <div id="add-task-urgent" class="add-task-priority-box pointer" onclick="changePriority('urgent')">
                    <div>Urgent</div>
                    <img src="/assets/img/Prio urgent.png" alt="">
                </div>
                `
            );
    }
}