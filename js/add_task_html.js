/**
 * Generates the inner HTML for a contact element based on the provided parameters.
 * @param {number} index - The index of the contact.
 * @param {string} selectedClass - The class indicating whether the contact is selected.
 * @param {string} name - The name of the contact.
 * @param {string} checkboxImage - The source URL of the checkbox image.
 * @returns {string} - The inner HTML string for the contact element.
 */
function contactElementInnerHTML(index, selectedClass, name, checkboxImage) {
    return (
        `
        <div onclick="selectContact(${index})" id="contact-${index}" class="add-task-contacts-to-assigne-list-item ${selectedClass}">
            <div class="name-box">${getInitials(name)}</div>
            <div class="name">${name}</div>
            <div class="checkbox"><img id="contact-checkbox-${index}" src="${checkboxImage}" alt="checkbox"></div>
        </div>
        `
    );
}


/**
 * Generates the inner HTML for a subtask list item based on the provided index and subtasks array.
 * @param {number} i - The index of the subtask.
 * @param {Array} subtasks - The array containing subtask information.
 * @returns {string} - The inner HTML string for the subtask list item.
 */
function subtaskListInnerHTML(i, subtasks) {
    return (
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
        `
    );
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
