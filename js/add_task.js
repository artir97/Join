let allTasks = [];
let allContacts = [];
let selectedPriority;
let selectedContact;
let selectedContacts = [];
let selectedCategory;
let subtasks = [];
let lastStatus = 'toDo';

async function initTaskData() {
    await loadContacts();
    await loadTasks();
    document.getElementById('add-task-contacts-to-assigne').innerHTML = renderAssignableContacts();
    changePriority('medium');
}

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


async function createTask() {
    const title = document.getElementById('add-task-title');
    const description = document.getElementById('add-task-description');
    const date = document.getElementById('add-task-date');
    if (!selectedPriority) {
        alert('Please choose a priority.');
        return;
    }
    const priority = assignPriority(selectedPriority);
    const assignedContact = selectedContacts;
    if (!selectedCategory) {
        alert('Please choose a category.');
        return;
    }
    const category = selectedCategory;
    const subtask = subtasks;
    const newTaskID = generateTaskID(allTasks.map(task => task.taskID));


    const newTask = {
        taskID: newTaskID,
        title: title.value,
        description: description.value,
        date: date.value,
        priority: priority,
        assignedContact: assignedContact.slice(), // Creates a new array
        category: category,
        subtask: subtask.slice(), // Creates a new array
        status: lastStatus
    };


    allTasks.push(newTask);
    await setItem('allTasks', JSON.stringify(allTasks));
    taskAddedPopup()
    clearForm();
    setTimeout(function () {
        window.location.href = 'board.html';
    }, 800)
}

async function updateMinDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').min = today;
}


async function loadTasks() {
    const tasksString = await getItem('allTasks');
    const loadedTasks = JSON.parse(tasksString);
    allTasks = [...loadedTasks];
}

// was there to empty the storage 
async function clearAllTasks() {
    allTasks = [];
    await setItem('allTasks', JSON.stringify(allTasks));
}


async function loadContacts() {
    const contactsString = await getItem("kontakte");
    const loadedContacts = JSON.parse(contactsString);

    allContacts.push(loadedContacts);
}


function getInitials(fullName) {
    if (!fullName) {
        return '';
    } else {
        const words = fullName.split(' ');
        const initials = words.map(word => word.charAt(0).toUpperCase());
        return initials.join('');
    }
}


let searchQuery = '';
function searchContactToAdd() {
    searchQuery = document.getElementById('searchbar-add-contacts').value.toLowerCase();
    const filteredContacts = allContacts[0].filter(contact => contact.name.toLowerCase().startsWith(searchQuery));

    // Now, you can render the filtered contacts
    const content = filteredContacts.map((contact, index) => assignContactsTemplate(contact.name, index)).join('');
    document.getElementById('add-task-contacts-to-assigne').innerHTML = content;
}

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


function renderAssignableContacts() {
    let content = '';
    for (let i = 0; i < allContacts[0].length; i++) {
        content += assignContactsTemplate(allContacts[0][i].name, i);
    }
    return content;
}


function unselectContact(contact, img) {
    contact.classList.remove('selectedContact');
    img.src = 'assets/img/add-task/checkbox.png';
    img.style.filter = 'none';
    selectedContact = null;

}


function assignPriority(priority) {
    switch (priority) {
        case 'urgent':
            changeColorUrgent();
            return 'urgent';
        case 'medium':
            changeColorMedium();
            return 'medium';
        case 'low':
            changeColorLow();
            return 'low';
        default:
            return 'none';
    }
}


function changePriority(priority) {
    if (selectedPriority) {
        document.getElementById(`add-task-${selectedPriority}`).classList.remove('selected');
    }
    selectedPriority = priority;
    document.getElementById(`add-task-${priority}`).classList.add('selected');
    assignPriority(priority);
}


function selectedTask(selectedTask) {
    document.getElementById('add-task-currently-selected-category').innerHTML = selectedTaskInnerHTML(selectedTask);
    showAndHideCategories();
    selectedCategory = selectedTask;
    return selectedTask;
}


function selectedTaskInnerHTML(selectedTask) {
    switch (selectedTask) {
        case 'technical-task':
            return 'Technical Task';
        case 'user-story':
            return 'User Story';
        default:
            return 'Select task category';
    }
}


function showAndHideContacts() {
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');
    let contactDropdown = document.getElementById('add-task-assigne');
    let contactSearchbarContainer = document.getElementById('searchbar-add-contacts-container');

    if (contactBox.classList.contains('d-none')) {
        contactBox.classList.remove('d-none');
        contactDropdown.classList.add('d-none');
        contactSearchbarContainer.classList.remove('d-none');
        selectedContactsMini.classList.add('d-none');
    } else {
        contactBox.classList.add('d-none');
        contactSearchbarContainer.classList.add('d-none');
        contactDropdown.classList.remove('d-none');
        selectedContactsMini.classList.remove('d-none');
        selectedContactsMini.innerHTML = renderSelectedContactsMini();
    }
}


function showAndHideCategories() {
    let taskBox = document.getElementById('add-task-category-dropdown');
    let arrowCategories = document.getElementById('arrow-categories');

    if (taskBox.classList.contains('d-none')) {
        taskBox.classList.remove('d-none');
        arrowCategories.style = 'transform: rotate(180deg);';
    } else {
        taskBox.classList.add('d-none');
        arrowCategories.style = 'transform: rotate(0deg);';

    }
}


function addSubtask() {
    let imgContainer = document.getElementById('add-task-subtask-image-container');
    imgContainer.innerHTML =
        `
        <img src="/assets/img/add-task/subtask-close.png" alt="" onclick="cancelAddSubtask()">
        <div class="hr"></div>
        <img src="/assets/img/add-task/subtask-check.png" alt="" onclick="confirmAddSubtask()">
        `;
}


function cancelAddSubtask() {
    let imgContainer = document.getElementById('add-task-subtask-image-container');
    let subtaskInput = document.getElementById('add-task-subtask-input');

    subtaskInput.value = '';
    imgContainer.innerHTML =
        `
         <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="addSubtask()">
        `;
}


function confirmAddSubtask() {
    let imgContainer = document.getElementById('add-task-subtask-image-container');
    let subtaskInput = document.getElementById('add-task-subtask-input');
    let subtaskList = document.getElementById('add-task-subtask-list');


    subtasks.push({
        text: subtaskInput.value,
        status: 'open'
    });

    // subtasks.push(subtaskInput.value);
    subtaskList.innerHTML = renderSubtasksAddTask();

    subtaskInput.value = '';
    imgContainer.innerHTML =
        `
        <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="addSubtask()">
        `;

}


function deleteAddedSubtask(i) {
    let subtaskList = document.getElementById('add-task-subtask-list');

    subtasks.splice(i, 1);
    subtaskList.innerHTML = renderSubtasksAddTask();
}


function openEditAddedSubtask(i) {
    let subtaskInput = document.getElementById(`add-task-subtask-input${i}`);
    let subtaskListItem = document.getElementById(`add-task-subtask-list-item${i}`);
    let subtaskEditContainer = document.getElementById(`add-task-edit-input-container${i}`);

    subtaskInput.value = subtasks[i].text;

    subtaskListItem.classList.add('d-none');    
    subtaskInput.classList.remove('d-none');
    subtaskEditContainer.classList.remove('d-none');
}


function confirmEditSubtask(i) {
    let subtaskInput = document.getElementById(`add-task-subtask-input${i}`);
    let subtaskListItem = document.getElementById(`add-task-subtask-list-item${i}`);
    let subtaskEditContainer = document.getElementById(`add-task-edit-input-container${i}`);
    let subtaskList = document.getElementById('add-task-subtask-list');

    subtasks[i].text = subtaskInput.value;

    subtaskListItem.classList.remove('d-none');
    subtaskInput.classList.add('d-none');
    subtaskEditContainer.classList.add('d-none');

    subtaskList.innerHTML = renderSubtasksAddTask();
}


function deleteEditSubtask(i) {
    deleteAddedSubtask(i);
}


function addDisplayNone(i) {
    let subtaskListElementButtons = document.getElementById(`add-task-subtask-list-buttons${i}`);
    subtaskListElementButtons.classList.add('d-none');
}


function removeDisplayNone(i) {
    let subtaskListElementButtons = document.getElementById(`add-task-subtask-list-buttons${i}`);
    subtaskListElementButtons.classList.remove('d-none');
}


// RENDER FUNCTIONs
function renderSelectedContactsMini() {
    let miniContacts = '';
    if (selectedContacts.length > 0) {
        for (let i = 0; i < selectedContacts.length; i++) {
            miniContacts += selectedContactMiniTemplate(getInitials(selectedContacts[i].name));
        }
    }
    return miniContacts;
}

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
            `;
        }
    }

    return subtaskList;
}



// TEMPLATES
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

    // Access the checkbox image element and set its style
    const checkboxImgElement = contactElement.querySelector(`#contact-checkbox-${index}`);
    if (contactFound) {
        checkboxImgElement.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }

    // Return the HTML string
    return contactElement.innerHTML;
}




function selectedContactMiniTemplate(name) {
    return (
        `<div class="name-box">${name}</div>`
    );
}

function getSubtasks(subtasks, i) {
    return (
        `<li>${subtasks[i]}</li>`
    );
}


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
}

// these functions probably have to be combined
function changeColorUrgent() {
    document.getElementById('add-task-urgent').style.backgroundColor = '#FF3D00';
    document.getElementById('add-task-urgent').style.color = '#fff';
    document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent white.png'

    document.getElementById('add-task-medium').style.backgroundColor = '#fff';
    document.getElementById('add-task-medium').style.color = '#000';
    document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium.png'

    document.getElementById('add-task-low').style.backgroundColor = '#fff';
    document.getElementById('add-task-low').style.color = '#000';
    document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low.png'
}


function changeColorMedium() {
    document.getElementById('add-task-medium').style.backgroundColor = '#FFA800';
    document.getElementById('add-task-medium').style.color = '#fff';
    document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium white.png'

    document.getElementById('add-task-urgent').style.backgroundColor = '#fff';
    document.getElementById('add-task-urgent').style.color = '#000';
    document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent.png'

    document.getElementById('add-task-low').style.backgroundColor = '#fff';
    document.getElementById('add-task-low').style.color = '#000';
    document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low.png'
}


function changeColorLow() {
    document.getElementById('add-task-low').style.backgroundColor = '#7AE229';
    document.getElementById('add-task-low').style.color = '#fff';
    document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low white.png'


    document.getElementById('add-task-urgent').style.backgroundColor = '#fff';
    document.getElementById('add-task-urgent').style.color = '#000';
    document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent.png'


    document.getElementById('add-task-medium').style.backgroundColor = '#fff';
    document.getElementById('add-task-medium').style.color = '#000';
    document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium.png'
}


function resetColorAll() {
    document.getElementById('add-task-low').style.backgroundColor = '#fff';
    document.getElementById('add-task-low').style.color = '#000';
    document.getElementById('add-task-low').querySelector('img').src = '/assets/img/Prio low.png'


    document.getElementById('add-task-urgent').style.backgroundColor = '#fff';
    document.getElementById('add-task-urgent').style.color = '#000';
    document.getElementById('add-task-urgent').querySelector('img').src = '/assets/img/Prio urgent.png'


    document.getElementById('add-task-medium').style.backgroundColor = '#fff';
    document.getElementById('add-task-medium').style.color = '#000';
    document.getElementById('add-task-medium').querySelector('img').src = '/assets/img/Prio medium.png'
}

function taskAddedPopup() {
    let success = document.getElementById('successTask');
    success.style.display = 'flex';
    setTimeout(function () {
        success.style.top = '50%';
    }, 50)
    // setTimeout(closeTaskAddedPopup, 400)
}

// function closeTaskAddedPopup() {
//     let success = document.getElementById('successTask');
//     success.style.top = '120%';
//     setTimeout(function() {
//         success.style.display = 'none';
//     }, 50 )
// }