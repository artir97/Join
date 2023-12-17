let allTasks = [];
let allContacts = [];
let selectedPriority;
let selectedContact;
let selectedContacts = [];
let selectedCategory;
let subtasks = [];


async function initTaskData() {
    await loadContacts();
    // await clearAllTasks();
    await loadTasks();
    document.getElementById('add-task-contacts-to-assigne').innerHTML = renderAssignableContacts();
    // document.getElementById('contactsPage').classList.remove('active');
    // document.getElementById('summaryPage').classList.remove('active');
    // document.getElementById('taskPage').classList.add('active');
    // document.getElementById('boardPage').classList.remove('active');
}


async function createTask() {
    const title = document.getElementById('add-task-title');
    const description = document.getElementById('add-task-description');
    const date = document.getElementById('add-task-date');
    const priority = assignPriority(selectedPriority);
    const assignedContact = selectedContacts;
    const category = selectedCategory;
    const subtask = subtasks;

    const newTask = {
        title: title.value,
        description: description.value,
        date: date.value,
        priority: priority,
        assignedContact: assignedContact.slice(), // Creates a new array
        category: category,
        subtask: subtask.slice() // Creates a new array
    };

    // Add the newTask directly to the allTasks array
    allTasks.push(newTask);

    console.log(allTasks);
    await setItem('allTasks', JSON.stringify(allTasks));
    console.log(allTasks);
    alert('Task created successfully');
    clearForm();
}

async function updateMinDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('add-task-date').min = today;
}


async function loadTasks() {
    try {
        const tasksString = await getItem('allTasks');
        const loadedTasks = JSON.parse(tasksString);
        // '...'  to prevent array nesting
        allTasks = [...loadedTasks];
        console.log('allTasks:', allTasks);
    } catch (e) {
        console.error('Error while loading the tasks:', e);
    }
}

// was there to empty the storage 
async function clearAllTasks() {
    allTasks = [];
    await setItem('allTasks', JSON.stringify(allTasks));
}


async function loadContacts() {
    try {
        const contactsString = await getItem("kontakte");
        const loadedContacts = JSON.parse(contactsString);

        allContacts.push(loadedContacts);
        console.log(allContacts);
    } catch (e) {
        console.error("Error while loading the contacts:", e);
    }
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


function renderAssignableContacts() {
    let content = '';
    for (let i = 0; i < allContacts[0].length; i++) {
        content += assignContactsTemplate(allContacts[0][i].name, i);
    }
    return content;
}


function selectContact(id) {
    selectedContact = allContacts[0][id];
    let contact = document.getElementById(`contact-${id}`);
    let emailToRemoveContact = selectedContact.email;
    let indexToRemoveContact = selectedContacts.findIndex(selectedContact => selectedContact.email === emailToRemoveContact);

    const checkboxImage = document.getElementById(`contact-checkbox-${id}`);

    if (contact.classList.contains('selectedContact')) {
        unselectContact(contact, checkboxImage);

        if (indexToRemoveContact !== -1) {
            selectedContacts.splice(indexToRemoveContact, 1);
            // console.log('selectedContactsAfterRemovingOne:', selectedContacts);
        }

    } else {
        selectedContacts.push(selectedContact);
        contact.classList.add('selectedContact');
        checkboxImage.src = 'assets/img/add-task/checkbox-checked.png';
        checkboxImage.style.filter = 'brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(5010%) hue-rotate(541deg) brightness(250%) contrast(155%)';
    }
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
            return null;
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
    }
}


function showAndHideContacts() {
    let selectedContactsMini = document.getElementById('add-task-selected-contacts-mini');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');

    if (contactBox.classList.contains('d-none')) {
        contactBox.classList.remove('d-none');
        selectedContactsMini.classList.add('d-none');

    } else {
        contactBox.classList.add('d-none');
        selectedContactsMini.classList.remove('d-none');
        selectedContactsMini.innerHTML = renderSelectedContactsMini();
    }
}


function showAndHideCategories() {
    let taskBox = document.getElementById('add-task-category-dropdown');

    if (taskBox.classList.contains('d-none')) {
        taskBox.classList.remove('d-none');
    } else {
        taskBox.classList.add('d-none');
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

    subtasks.push(subtaskInput.value);
    subtaskList.innerHTML = renderSubtasks();

    subtaskInput.value = '';
    imgContainer.innerHTML =
        `
        <img src="/assets/img/add-task/subtask-add.png" alt="" onclick="addSubtask()">
        `;

}

function deleteAddedSubtask(i){
    let subtaskList = document.getElementById('add-task-subtask-list');

    subtasks.splice(i, 1);
    subtaskList.innerHTML = renderSubtasks();
}

function editAddedSubtsak(i){
    let subtaskList = document.getElementById('add-task-subtask-list');
    let editedSubtask = subtasks[i];

    console.table(editedSubtask);

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

function renderSubtasks() {
    let subtaskList = '';

    if (subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            // subtaskList += `<li>${subtasks[i]}</li>`;

            subtaskList += 
            `
            <li onmouseenter="removeDisplayNone(${i})" onmouseleave="addDisplayNone(${i})">
                <span>${subtasks[i]}</span>
                <div id="add-task-subtask-list-buttons${i}" class="d-none">
                    <input>
                    <img onclick="editAddedSubtsak(${i})" src="/assets/img/add-task/subtask-edit.png" alt="" height="24px" width="24px">
                    <div class="hr"></div>
                    <img onclick="deleteAddedSubtask(${i})" src="/assets/img/add-task/subtask-delete.png" alt="" height="24px" width="24px">
                </div>
            </li>
            `;
        }
    }

    return subtaskList;

}



// TEMPLATES

function assignContactsTemplate(name, id) {
    return (
        `         
        <div onclick="selectContact(${id})" id="contact-${id}" class="add-task-contacts-to-assigne-list-item">
            <div class="name-box">${getInitials(name)}</div>
            <div class="name">${name}</div>
            <div class="checkbox"><img id="contact-checkbox-${id}" src="assets/img/add-task/checkbox.png" alt="checkbox"></div>
        </div>
        `
    );
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
    document.getElementById('add-task-title').value = '';
    document.getElementById('add-task-description').value = '';
    document.getElementById('add-task-date').value = '';
    // document.getElementById('add-task-subtask').value = '';
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