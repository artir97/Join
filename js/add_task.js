let allTasks = [];
let allContacts = [];
let selectedPriority;
let selectedContact;
let selectedContacts = [];
let selectedCategory;


async function initTaskData() {
    await loadContacts();
    document.getElementById('add-task-contacts-to-assigne').innerHTML = renderAssignableContacts();

}

async function createTask() {
    const title = document.getElementById('add-task-title');
    const description = document.getElementById('add-task-description');
    const date = document.getElementById('add-task-date');
    const priority = assignPriority(selectedPriority);
    const assignedContact = selectedContacts;
    const category = selectedCategory;
    const subtask = document.getElementById('add-task-subtask');

    // console.logs can be removed when done
    console.log('in createTask button');
    console.log('Title:', title.value);
    console.log('Description:', description.value);
    console.log('Date:', date.value);
    console.log('Assigne:', assignedContact)
    console.log('Priority:', priority);
    console.log('Category:', category);
    console.log('Subtask:', subtask.value);

    allTasks.push({
        title: title.value,
        description: description.value,
        date: date.value,
        priority: priority,
        assignedContact: selectedContacts,
        category: selectedCategory,
        subtask: subtask.value
    });

    await setItem('allTasks', JSON.stringify(allTasks));
    alert('Task created successfully');
    clearForm();
}

async function loadContacts() {
    try {
        const contactsString = await getItem("contacts");
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
            console.log('selectedContactsAfterRemovingOne:', selectedContacts);
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

function selectedTaskInnerHTML(selectedTask){
    switch(selectedTask) {
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




































function clearForm() {
    document.getElementById('add-task-title').value = '';
    document.getElementById('add-task-description').value = '';
    document.getElementById('add-task-date').value = '';
    document.getElementById('add-task-subtask').value = '';
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