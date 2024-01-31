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

        if (assignedContacts.length > 3) {
            assignedContactHTML += `
                <div class="boardNameBoxExtra">
                    +${assignedContacts.length - 3}
                </div>`;
        }
    }
    return assignedContactHTML;
}