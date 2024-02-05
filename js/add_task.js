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


/**
 * Displays or hides an alert for the task category based on the provided selection.
 * @param {boolean} selectedCategory - Indicates whether a category is selected or not.
 * @returns {void} - The function does not return a value.
 */
function alertCategory(selectedCategory) {
    let category = document.getElementById('add-task-category-alert');
    if (selectedCategory) {
        removeAlertCategory();
    } else {
        category.classList.remove('d-none');
    }
}


/**
 * Removes the alert for the task category by hiding the corresponding DOM element.
 * @returns {void} - The function does not return a value.
 */
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
    selectedContact = filteredContacts[id];
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
    if (document.location.pathname.includes('add_task.html') || document.location.pathname.includes('board.html')) {
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
    if (document.location.pathname.includes('add_task.html') || document.location.pathname.includes('board.html')) {
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
    let subtaskAlert = document.getElementById('add-task-subtask-alert');
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


/**
 * Removes the alert for adding subtasks by hiding the corresponding DOM element.
 * @returns {void} - The function does not return a value.
 */
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
    if (subtaskInput.value.trim() == '') {
        subtaskEditEmptyAlert.classList.remove('d-none');
    } else {
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
            subtaskList += subtaskListInnerHTML(i, subtasks);
        }
    }
    return subtaskList;
}


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
    contactElement.innerHTML = contactElementInnerHTML(index, selectedClass, name, checkboxImage);
    const checkboxImgElement = contactElement.querySelector(`#contact-checkbox-${index}`);
    if (contactFound) {
        checkboxImgElement.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }
    return contactElement.innerHTML;
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


/**
 * Clears the selected state of all contacts.
 * @returns {void} - The function does not return a value.
 */
function clearContacts() {
    for (let i = 0; i < allContacts[0].length; i++) {
        clearContact(i);
    }
}


/**
 * Clears the selected state of a contact by its ID.
 * @param {string} id - The unique identifier of the contact to be cleared.
 * @returns {void} - The function does not return a value.
 */
function clearContact(id) {
    let contact = document.getElementById(`contact-${id}`);
    let checkboxImage = document.getElementById(`contact-checkbox-${id}`);
    if (contact.classList.contains('selectedContact')) {
        unselectContact(contact, checkboxImage);
    }
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