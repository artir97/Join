let allTasks = [];
let allContacts = [];
let selectedPriority;
let selectedContact;
let selectedContacts = [];
let selectedCategory;
let subtasks = [];
let lastStatus = 'toDo';
let searchQuery = '';


/**
 * Initializes task data by loading contacts, tasks, and setting up the user interface. *
 * @async
 * @function
 */
async function initTaskData() {
    await loadContacts();
    await loadTasks();
    document.getElementById('add-task-contacts-to-assigne').innerHTML = renderAssignableContacts();
    changePriority('medium');
}


/**
 * Generates a unique task ID based on the current timestamp and a random number.
 * @param {Array<number>} existingIDs - An array of existing task IDs to check for uniqueness.
 * @returns {number} - A unique task ID.
 * @function
 */
function generateTaskID(existingIDs) {
    let isUnique = false;
    let newID;

    while (!isUnique) {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        newID = timestamp + random;
        isUnique = !existingIDs.includes(newID);
    }
    return newID;
}


/**
 * Creates a new task with the provided details and adds it to the task list.
 * @async
 * @function
 * @throws {Alert} - Displays alerts for missing priority or category selections.
 */
async function createTask() {
    const title = document.getElementById('add-task-title');
    const description = document.getElementById('add-task-description');
    const date = document.getElementById('add-task-date');
    const priority = assignPriority(selectedPriority);
    const assignedContact = selectedContacts;
    const category = selectedCategory;
    const subtask = subtasks;
    const newTaskID = generateTaskID(allTasks.map(task => task.taskID));


    const newTask = {
        taskID: newTaskID,
        title: title.value,
        description: description.value,
        date: date.value,
        priority: priority,
        assignedContact: assignedContact.slice(),
        category: category,
        subtask: subtask.slice(),
        status: lastStatus
    };

    if (!selectedCategory) {
        alertCategory(selectedCategory);
        return;
    }

    allTasks.push(newTask);
    await setItem('allTasks', JSON.stringify(allTasks));

    if (window.location.href.endsWith('add_task.html')) {
        taskAddedPopup();
        setTimeout(function () {
            window.location.href = 'board.html';
        }, 800);
    }

    clearForm();

}

function alertCategory(selectedCategory) {
    let category = document.getElementById('add-task-category-alert');
    if (selectedCategory) {
        removeAlertCategory();
    } else {
        category.classList.remove('d-none');
    }
}

function removeAlertCategory() {
    let category = document.getElementById('add-task-category-alert');
    category.classList.add('d-none');
}


/**
 * Updates the minimum date of the task input to the current date.
 * @async
 * @function
 */
async function updateMinDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').min = today;
}


/**
 * Loads tasks from local storage and populates the 'allTasks' array.f
 * @async
 * @function
 */
async function loadTasks() {
    const tasksString = await getItem('allTasks');
    const loadedTasks = JSON.parse(tasksString);
    allTasks = [...loadedTasks];
}


/**
 * Loads contacts from local storage and populates the 'allContacts' array.
 * @async
 * @function
 */
async function loadContacts() {
    const contactsString = await getItem("kontakte");
    const loadedContacts = JSON.parse(contactsString);

    allContacts.push(loadedContacts);
}


/**
 * Generates initials from a full name. *
 * @param {string} fullName - The full name from which initials are generated.
 * @returns {string} - The generated initials.
 * @function
 */
function getInitials(fullName) {
    if (!fullName) {
        return '';
    } else {
        const words = fullName.split(' ');
        const initials = words.map(word => word.charAt(0).toUpperCase());
        return initials.join('');
    }
}


/**
 * Searches for contacts to add based on the input search query. *
 * @function
 */
function searchContactToAdd() {
    searchQuery = document.getElementById('searchbar-add-contacts').value.toLowerCase();
    const filteredContacts = allContacts[0].filter(contact => contact.name.toLowerCase().startsWith(searchQuery));

    // Now, you can render the filtered contacts
    const content = filteredContacts.map((contact, index) => assignContactsTemplate(contact.name, index)).join('');
    document.getElementById('add-task-contacts-to-assigne').innerHTML = content;
}


/**
 * Selects or unselects a contact based on the provided ID and updates the selected contacts array.
 * @param {number} id - The ID of the contact to be selected or unselected.
 * @function
 */
function selectContact(id) {
    const filteredContacts = allContacts[0].filter(contact => contact.name.toLowerCase().startsWith(searchQuery));
    selectedContact = filteredContacts[id]; // Use the correct index from the filtered list

    let contact = document.getElementById(`contact-${id}`);
    let emailToRemoveContact = selectedContact.email;
    let indexToRemoveContact = selectedContacts.findIndex(selectedContact => selectedContact.email === emailToRemoveContact);

    const checkboxImage = document.getElementById(`contact-checkbox-${id}`);

    if (contact.classList.contains('selectedContact')) {
        unselectContact(contact, checkboxImage);

        if (indexToRemoveContact !== -1) {
            selectedContacts.splice(indexToRemoveContact, 1);
        }
    } else {
        selectedContacts.push(selectedContact);
        contact.classList.add('selectedContact');
        checkboxImage.src = 'assets/img/add-task/checkbox-checked.png';
        checkboxImage.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }
}


/**
 * Renders the HTML content for assignable contacts based on the 'allContacts' array.
 * @returns {string} - The HTML content for assignable contacts.
 * @function
 */
function renderAssignableContacts() {
    let content = '';
    for (let i = 0; i < allContacts[0].length; i++) {
        content += assignContactsTemplate(allContacts[0][i].name, i);
    }
    return content;
}


/**
 * Unselects a contact by removing the 'selectedContact' class and resetting the checkbox appearance.
 * @param {HTMLElement} contact - The DOM element representing the contact to be unselected.
 * @param {HTMLImageElement} img - The checkbox image element associated with the contact.
 * @function
 */
function unselectContact(contact, img) {
    contact.classList.remove('selectedContact');
    img.src = 'assets/img/add-task/checkbox.png';
    img.style.filter = 'none';
    selectedContact = null;
}


/**
 * Assigns a priority level and updates the UI based on the provided priority.
 * @param {string} priority - The priority level to be assigned ('urgent', 'medium', 'low', or other).
 * @returns {string} - The assigned priority value.
 * @function
 */
function assignPriority(priority) {
    switch (priority) {
        case 'urgent':
            return 'urgent';
        case 'medium':
            return 'medium';
        case 'low':
            return 'low';
        default:
            return 'none';
    }
}


function assignPriorityClick(priority) {
    switch (priority) {
        case 'urgent':
            let urgentColor = changeColorUrgent();
            if (urgentColor == 'none') {
                selectedPriority = 'none';
                return 'none';
            } else {
                return 'urgent';
            }
        case 'medium':
            let mediumColor = changeColorMedium();
            if (mediumColor == 'none') {
                selectedPriority = 'none';
                return 'none';
            } else {
                return 'medium';
            }
        case 'low':
            let lowColor = changeColorLow();
            if (lowColor == 'none') {
                selectedPriority = 'none';
                return 'none';
            } else {
                return 'low';
            }
        default:
            return 'none';
    }
}

/**
 * Changes the priority level for a task, updates the UI, and assigns the new priority.
 * @param {string} priority - The new priority level to be set ('urgent', 'medium', 'low', or other).
 * @function
 */
function changePriority(priority) {
    if (selectedPriority && selectedPriority !== 'none') {
        document.getElementById(`add-task-${selectedPriority}`).classList.remove('selected');
    }

    selectedPriority = priority;
    document.getElementById(`add-task-${priority}`).classList.add('selected');
    assignPriorityClick(priority);
}


/**
 * Handles the selection of a task category, updates the UI, and sets the selected category.
 * @param {string} selectedTask - The selected task category ('technical-task', 'user-story', or other).
 * @returns {string} - The selected task category.
 * @function
 */
function selectedTask(selectedTask) {
    document.getElementById('add-task-currently-selected-category').innerHTML = selectedTaskInnerHTML(selectedTask);
    showAndHideCategories();
    selectedCategory = selectedTask;
    return selectedTask;
}


/**
 * Generates innerHTML content for the currently selected task category based on the provided category.
 * @param {string} selectedTask - The selected task category ('technical-task', 'user-story', or other).
 * @returns {string} - The innerHTML content for the currently selected task category.
 * @function
 */
function selectedTaskInnerHTML(selectedTask) {
    switch (selectedTask) {
        case 'technical-task':
            removeAlertCategory();
            return 'Technical Task';
        case 'user-story':
            removeAlertCategory();
            return 'User Story';
        default:
            return 'Select task category';
    }
}


/**
 * Toggles the visibility of the contacts section in the task creation form.
 * @function
 */
function showAndHideContacts() {
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');

    if (contactBox.classList.contains('d-none')) {
        showContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    } else {
        hideContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    }
}


/**
 * Displays the contacts section in the task creation form and updates related UI elements.
 * @param {HTMLElement} selectedContactsMini - The DOM element representing the mini contacts display.
 * @param {HTMLElement} contactBox - The DOM element representing the contacts box to be shown.
 * @param {HTMLElement} contactDropdown - The DOM element representing the contacts dropdown to be hidden.
 * @param {HTMLElement} contactSearchbarContainer - The DOM element representing the container of the contacts search bar.
 * @function
 */
function showContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer) {
    contactBox.classList.remove('d-none');
    contactDropdown.classList.add('d-none');
    contactSearchbarContainer.classList.remove('d-none');
    selectedContactsMini.classList.add('d-none');
}


/**
 * Hides the contacts section in the task creation form and updates related UI elements.
 * @param {HTMLElement} selectedContactsMini - The DOM element representing the mini contacts display.
 * @param {HTMLElement} contactBox - The DOM element representing the contacts box to be hidden.
 * @param {HTMLElement} contactDropdown - The DOM element representing the contacts dropdown to be shown.
 * @param {HTMLElement} contactSearchbarContainer - The DOM element representing the container of the contacts search bar.
 * @function 
 */
function hideContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer) {
    if (document.location.pathname.includes("add_task.html")) {
    contactBox.classList.add('d-none');
    contactSearchbarContainer.classList.add('d-none');
    contactDropdown.classList.remove('d-none');
    selectedContactsMini.classList.remove('d-none');
    selectedContactsMini.innerHTML = renderSelectedContactsMini();
    }
}


/**
 * Toggles the visibility of the task categories dropdown and updates the arrow indicator.
 * @function
 */
function showAndHideCategories() {
    let taskBox = document.getElementById('add-task-category-dropdown');
    let arrowCategories = document.getElementById('arrow-categories');

    if (taskBox.classList.contains('d-none')) {
        showCategories(taskBox, arrowCategories);
    } else {
        hideCategories(taskBox, arrowCategories);
    }


}


/**
 * Displays the task categories dropdown and rotates the arrow indicator.
 * @param {HTMLElement} taskBox - The DOM element representing the task categories dropdown to be shown.
 * @param {HTMLElement} arrowCategories - The DOM element representing the arrow indicator for task categories.
 * @function
 */
function showCategories(taskBox, arrowCategories) {
    taskBox.classList.remove('d-none');
    arrowCategories.style = 'transform: rotate(180deg);';
}


/**
 * Hides the task categories dropdown and resets the arrow indicator rotation.
 * @param {HTMLElement} taskBox - The DOM element representing the task categories dropdown to be hidden.
 * @param {HTMLElement} arrowCategories - The DOM element representing the arrow indicator for task categories.
 * @function
 */
function hideCategories(taskBox, arrowCategories) {
    if (document.location.pathname.includes("add_task.html")) {
    taskBox.classList.add('d-none');
    arrowCategories.style = 'transform: rotate(0deg);';
    }
}


/**
 * Handles the click event on the document and hides contacts and categories dropdowns.
 * @param {Event} event - The click event object.
 * @function
 */
function handleClick(event) {
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');

    let taskBox = document.getElementById('add-task-category-dropdown');
    let arrowCategories = document.getElementById('arrow-categories');

    if (getComputedStyle(event.target).cursor !== 'pointer') {
        hideContacts(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
        hideCategories(taskBox, arrowCategories);
    }
}

// Add the 'click' event listener to the document, calling the 'handleClick' function
document.addEventListener('click', handleClick);


/**
 * Confirms the addition of a subtask to the list.
 * @function
 */
function confirmAddSubtask() {
    let subtaskInput = document.getElementById('add-task-subtask-input');
    let subtaskList = document.getElementById('add-task-subtask-list');
    let subtaskAlert =  document.getElementById('add-task-subtask-alert');
    if (subtaskInput.value.trim() == '') {
        subtaskAlert.classList.remove('d-none');
    } else {
        subtasks.push({
            text: subtaskInput.value,
            status: 'open'
        });

        subtaskList.innerHTML = renderSubtasksAddTask();
        subtaskInput.value = '';
        removeAlertSubtask();
    }
}

function removeAlertSubtask() {
    let subtask = document.getElementById('add-task-subtask-alert');
    subtask.classList.add('d-none');
}


/**
 * Deletes the added subtask at the specified index.
 * @param {number} i - The index of the subtask to be deleted.
 * @function
 */
function deleteAddedSubtask(i) {
    let subtaskList = document.getElementById('add-task-subtask-list');

    subtasks.splice(i, 1);
    subtaskList.innerHTML = renderSubtasksAddTask();
}


/**
 * Opens the editing mode for the added subtask at the specified index.
 * @param {number} i - The index of the subtask to be edited.
 * @function
 */
function openEditAddedSubtask(i) {
    let subtaskInput = document.getElementById(`add-task-subtask-input${i}`);
    let subtaskListItem = document.getElementById(`add-task-subtask-list-item${i}`);
    let subtaskEditContainer = document.getElementById(`add-task-edit-input-container${i}`);

    subtaskInput.value = subtasks[i].text;

    subtaskListItem.classList.add('d-none');
    subtaskInput.classList.remove('d-none');
    subtaskEditContainer.classList.remove('d-none');
}


/**
 * Confirms the edit for the subtask at the specified index.
 * @param {number} i - The index of the edited subtask.
 * @function
 */
function confirmEditSubtask(i) {
    let subtaskInput = document.getElementById(`add-task-subtask-input${i}`);
    let subtaskListItem = document.getElementById(`add-task-subtask-list-item${i}`);
    let subtaskEditContainer = document.getElementById(`add-task-edit-input-container${i}`);
    let subtaskList = document.getElementById('add-task-subtask-list');
    let subtaskEditEmptyAlert = document.getElementById(`add-task-subtask-edit-${i}`);

    if(subtaskInput.value.trim() == ''){
        subtaskEditEmptyAlert.classList.remove('d-none');
    }else{
        subtasks[i].text = subtaskInput.value;
        subtaskEditEmptyAlert.classList.add('d-none');
        subtaskListItem.classList.remove('d-none');
        subtaskInput.classList.add('d-none');
        subtaskEditContainer.classList.add('d-none');
    
        subtaskList.innerHTML = renderSubtasksAddTask();
    }
}


/**
 * Deletes the subtask at the specified index during the editing process.
 * @param {number} i - The index of the subtask to be deleted.
 * @function
 */
function deleteEditSubtask(i) {
    deleteAddedSubtask(i);
}


/**
 * Hides the action buttons for a specific subtask list element.
 * @param {number} i - The index of the subtask for which the action buttons should be hidden.
 * @function
 */
function addDisplayNone(i) {
    let subtaskListElementButtons = document.getElementById(`add-task-subtask-list-buttons${i}`);
    subtaskListElementButtons.classList.add('d-none');
}


/**
 * Reveals the action buttons for a specific subtask list element.
 * @param {number} i - The index of the subtask for which the action buttons should be revealed.
 * @function
 */
function removeDisplayNone(i) {
    let subtaskListElementButtons = document.getElementById(`add-task-subtask-list-buttons${i}`);
    subtaskListElementButtons.classList.remove('d-none');
}


// RENDER FUNCTIONs
/**
 * Renders the HTML content for the mini display of selected contacts.
 * @returns {string} - The HTML content for the mini display of selected contacts.
 * @function
 */
function renderSelectedContactsMini() {
    let miniContacts = '';
    if (selectedContacts.length > 0) {
        for (let i = 0; i < selectedContacts.length; i++) {
            miniContacts += selectedContactMiniTemplate(getInitials(selectedContacts[i].name));
        }
    }
    return miniContacts;
}


/**
 * Renders the HTML content for the list of subtasks in the "Add Task" form.
 * @returns {string} - The HTML content for the list of subtasks.
 * @function
 */
function renderSubtasksAddTask() {
    let subtaskList = '';

    if (subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            subtaskList +=
                `
            <li id="add-task-subtask-list-item${i}" onclick="openEditAddedSubtask(${i})"  onmouseenter="removeDisplayNone(${i})" onmouseleave="addDisplayNone(${i})">
                <span>${subtasks[i].text}</span>
                <div id="add-task-subtask-list-buttons${i}" class="d-none">
                    <img onclick="openEditAddedSubtask(${i})" src="/assets/img/add-task/subtask-edit.png" alt="" height="24px" width="24px">
                    <div class="hr"></div>
                    <img onclick="deleteAddedSubtask(${i})" src="/assets/img/add-task/subtask-delete.png" alt="" height="24px" width="24px">
                </div>
            </li>

            <div class="d-none subtask-edit-input-container" id="add-task-edit-input-container${i}">
                <input class="pointer" type="text" id="add-task-subtask-input${i}">
                <div>
                    <img onclick="deleteAddedSubtask(${i})" src="/assets/img/add-task/subtask-delete.png" alt="" height="24px" width="24px">
                    <div class="hr"></div>
                    <img onclick="confirmEditSubtask(${i})"src="/assets/img/add-task/subtask-check.png" alt="" height="24px" width="24px">
                </div>
            </div>

            <div class="d-none" id="add-task-subtask-edit-${i}">
                <span style="color: red;">You can't add an empty subtask</span>
            </div>
            `;
        }
    }

    return subtaskList;
}


// TEMPLATES
/**
 * Generates the HTML template for a contact in the "Add Task" form.
 * @param {string} name - The full name of the contact.
 * @param {number} index - The index of the contact in the list.
 * @returns {string} - The HTML template for the contact.
 * @function
 */
function assignContactsTemplate(name, index) {
    const contactFound = selectedContacts.find(c => c.name == name);
    let selectedClass = '';
    let checkboxImage = `assets/img/add-task/checkbox.png`;

    if (contactFound) {
        selectedClass = 'selectedContact';
        checkboxImage = 'assets/img/add-task/checkbox-checked.png';
    }

    const contactElement = document.createElement('div');
    contactElement.innerHTML = `
        <div onclick="selectContact(${index})" id="contact-${index}" class="add-task-contacts-to-assigne-list-item ${selectedClass}">
            <div class="name-box">${getInitials(name)}</div>
            <div class="name">${name}</div>
            <div class="checkbox"><img id="contact-checkbox-${index}" src="${checkboxImage}" alt="checkbox"></div>
        </div>
    `;

    const checkboxImgElement = contactElement.querySelector(`#contact-checkbox-${index}`);
    if (contactFound) {
        checkboxImgElement.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }

    return contactElement.innerHTML;
}


/**
 * Generates the HTML template for a mini version of a selected contact.
 * @param {string} name - The initials of the selected contact.
 * @returns {string} - The HTML template for the mini version of the selected contact.
 * @function
 */
function selectedContactMiniTemplate(name) {
    return (
        `<div class="name-box">${name}</div>`
    );
}


/**
 * Generates the HTML template for displaying a subtask.
 * @param {string[]} subtasks - An array of subtasks.
 * @param {number} i - The index of the subtask to display.
 * @returns {string} - The HTML template for displaying the specified subtask.
 * @function
 */
function getSubtasks(subtasks, i) {
    return (
        `<li>${subtasks[i]}</li>`
    );
}


/**
 * Clears the input form for adding a new task.
 * @function
 */
function clearForm() {
    document.querySelector('input[type="date"]').value = '';
    document.getElementById('add-task-title').value = '';
    document.getElementById('add-task-description').value = '';
    document.getElementById('add-task-date').value = '';
    document.getElementById('add-task-subtask-input').value = '';
    selectedCategory = null;
    resetColorAll();
    document.getElementById('add-task-currently-selected-category').innerHTML = selectedTaskInnerHTML('');
    selectedContacts = [];
    document.getElementById('add-task-selected-contacts-mini').innerHTML = renderSelectedContactsMini();
    subtasks = [];
    document.getElementById('add-task-subtask-list').innerHTML = renderSubtasksAddTask();
    clearContacts();
}

function clearContacts(){
    for(let i = 0; i < allContacts[0].length; i++){
        clearContact(i);
    }
}

function clearContact(id){
    let contact = document.getElementById(`contact-${id}`);
    let checkboxImage = document.getElementById(`contact-checkbox-${id}`);

    if (contact.classList.contains('selectedContact')) {
        unselectContact(contact, checkboxImage);
    }
}

/**
 * Changes the color scheme for the 'Urgent' priority category.
 * @function
 */
function changeColorUrgent() {
    if (document.getElementById('add-task-urgent').style.backgroundColor == 'rgb(255, 61, 0)') {
        resetColorAll();
        return 'none';
    } else {
        document.getElementById('add-task-urgent').style.backgroundColor = '#FF3D00';
        document.getElementById('add-task-urgent').style.color = '#fff';
        document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent white.png';

        document.getElementById('add-task-medium').style.backgroundColor = '#fff';
        document.getElementById('add-task-medium').style.color = '#000';
        document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium.png';

        document.getElementById('add-task-low').style.backgroundColor = '#fff';
        document.getElementById('add-task-low').style.color = '#000';
        document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low.png';
    }

}


/**
 * Changes the color scheme for the 'Medium' priority category.
 * @function
 */
function changeColorMedium() {
    if (document.getElementById('add-task-medium').style.backgroundColor == 'rgb(255, 168, 0)') {
        resetColorAll();
        return 'none';
    } else {
        document.getElementById('add-task-medium').style.backgroundColor = '#FFA800';
        document.getElementById('add-task-medium').style.color = '#fff';
        document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium white.png';

        document.getElementById('add-task-urgent').style.backgroundColor = '#fff';
        document.getElementById('add-task-urgent').style.color = '#000';
        document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent.png';

        document.getElementById('add-task-low').style.backgroundColor = '#fff';
        document.getElementById('add-task-low').style.color = '#000';
        document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low.png';
    }

}


/**
 * Changes the color scheme for the 'Low' priority category.
 * @function
 */
function changeColorLow() {
    if (document.getElementById('add-task-low').style.backgroundColor == 'rgb(122, 226, 41)') {
        resetColorAll();
        return 'none';
    } else {
        document.getElementById('add-task-low').style.backgroundColor = '#7AE229';
        document.getElementById('add-task-low').style.color = '#fff';
        document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low white.png';


        document.getElementById('add-task-urgent').style.backgroundColor = '#fff';
        document.getElementById('add-task-urgent').style.color = '#000';
        document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent.png';


        document.getElementById('add-task-medium').style.backgroundColor = '#fff';
        document.getElementById('add-task-medium').style.color = '#000';
        document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium.png';
    }

}


/**
 * Resets the color scheme for all priority categories.
 * @function
 */
function resetColorAll() {
    document.getElementById('add-task-low').style.backgroundColor = '#fff';
    document.getElementById('add-task-low').style.color = '#000';
    document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low.png';


    document.getElementById('add-task-urgent').style.backgroundColor = '#fff';
    document.getElementById('add-task-urgent').style.color = '#000';
    document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent.png';


    document.getElementById('add-task-medium').style.backgroundColor = '#fff';
    document.getElementById('add-task-medium').style.color = '#000';
    document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium.png';
}


/**
 * Displays a success popup for the added task.
 * @function
 */
function taskAddedPopup() {
    let success = document.getElementById('successTask');
    success.style.display = 'flex';
    setTimeout(function () {
        success.style.top = '50%';
    }, 50)
}