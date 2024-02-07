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

        if (assignedContacts.length > 3) {console
            assignedContactHTML += `
                <div class="boardNameBoxExtra">
                    +${assignedContacts.length - 3}
                </div>`;
        }
    }
    return assignedContactHTML;
}


/**
 * Selects or deselects an assigned contact for a given task.
 * @param {string} elementID - The ID of the task element.
 * @param {number} index - The index of the contact.
 */
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
 * Renders the mini-view of selected contacts for editing.
 * @param {Array} selectedContactsEdit - The array of selected contacts for editing.
 * @returns {string} - The HTML content of the mini-view of selected contacts.
 */
function renderSelectedContactsMiniEdit(selectedContactsEdit) {
    let miniContacts = '';
    if (selectedContactsEdit.length > 0) {
        for (let i = 0; i < selectedContactsEdit.length; i++) {
            miniContacts += selectedContactMiniTemplate(getInitials(selectedContactsEdit[i].name));
        }
    }
    return miniContacts;
}


/**
 * Shows or hides the contacts edit interface based on its current state.
 * @param {string} elementID - The ID of the element.
 */
function showAndHideContactsEdit(elementID) {
    const element = allTasks.filter(task => task['taskID']  === elementID);
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne-edit');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');
    let selectedContactsEdit = element[0]['assignedContact'];

    if (contactBox.classList.contains('d-none')) {
        showContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer);
    } else {
        hideContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer,selectedContactsEdit);
    }
}


/**
 * Shows the contacts edit interface and hides the selected contacts mini-view.
 * @param {HTMLElement} selectedContactsMini - The selected contacts mini-view element.
 * @param {HTMLElement} contactBox - The contact box element to show.
 * @param {HTMLElement} contactDropdown - The contact dropdown element to hide.
 * @param {HTMLElement} contactSearchbarContainer - The container for the contact search bar to show.
 */
function showContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer) {
    contactBox.classList.remove('d-none');
    contactDropdown.classList.add('d-none');
    contactSearchbarContainer.classList.remove('d-none');
    selectedContactsMini.classList.add('d-none');
}


/**
 * Hides the contacts edit interface and shows the selected contacts mini-view.
 * @param {HTMLElement} selectedContactsMini - The selected contacts mini-view element.
 * @param {HTMLElement} contactBox - The contact box element to hide.
 * @param {HTMLElement} contactDropdown - The contact dropdown element to show.
 * @param {HTMLElement} contactSearchbarContainer - The container for the contact search bar to hide.
 * @param {Array} selectedContactsEdit - The array of selected contacts for editing.
 */
function hideContactsEdit(selectedContactsMini, contactBox, contactDropdown, contactSearchbarContainer,selectedContactsEdit) {
    if (document.location.pathname.includes('add_task.html') || document.location.pathname.includes('board.html')) {
        contactBox.classList.add('d-none');
        contactSearchbarContainer.classList.add('d-none');
        contactDropdown.classList.remove('d-none');
        selectedContactsMini.classList.remove('d-none');
        selectedContactsMini.innerHTML = renderSelectedContactsMiniEdit(selectedContactsEdit);
    }
}


/**
 * Renders the assignable contacts for editing.
 * @param {string} elementID - The ID of the element.
 * @returns {string} - The HTML content of assignable contacts.
 */
function renderAssignableContactsEdit(elementID){
    const element = allTasks.filter(task => task['taskID']  === elementID);

    let content = '';
    for (let i = 0; i < allContacts[0].length; i++) {
        content += assignContactsTemplateEdit(allContacts[0][i].name, i, element, elementID);
    }
    return content;
}


/**
 * Generates HTML template for assigning contacts for editing.
 * @param {string} name - The name of the contact.
 * @param {number} index - The index of the contact.
 * @param {Array} element - The array of elements.
 * @param {string} elementID - The ID of the element.
 * @returns {string} - The HTML content of the contact template.
 */
function assignContactsTemplateEdit(name, index, element, elementID) {
    const contactFound = element[0].assignedContact.find(c => c.name == name);
    let selectedClass = '';
    let checkboxImage = `assets/img/add-task/checkbox.png`;

    if (contactFound) {
        selectedClass = 'selectedContact';
        checkboxImage = 'assets/img/add-task/checkbox-checked.png';
    }

    const contactElement = document.createElement('div');
    contactElement.innerHTML = `
        <div onclick="selectContact(${index}), selectAssignedContact(${elementID}, ${index})" id="contact-${index}" class="add-task-contacts-to-assigne-list-item ${selectedClass}">
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
 * Searches for contacts to add for editing.
 * @param {string} elementID - The ID of the element.
 */
function searchContactToAddEdit(elementID) {
    const element = allTasks.filter(task => task['taskID']  === elementID);

    searchQuery = document.getElementById('searchbar-add-contacts').value.toLowerCase();
    const filteredContacts = allContacts[0].filter(contact => contact.name.toLowerCase().startsWith(searchQuery));

    const content = filteredContacts.map((contact, index) => assignContactsTemplateEdit(contact.name, index, element)).join('');
    document.getElementById('add-task-contacts-to-assigne-edit').innerHTML = content;
}