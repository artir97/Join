let allTasks = [];




async function createTask() {
    const title = document.getElementById('add-task-title');
    const description = document.getElementById('add-task-description');
    const date = document.getElementById('add-task-date');
    const priority = '';
    const assignedContact = '';
    const category = '';
    const subtask = document.getElementById('add-task-subtask');

    console.log('in createTask button');
    console.log('pushing: ' + title.value + " " + description.value + " " + date.value);



    allTasks.push(
        {
            title: title.value,
            description: description.value,
            date: date.value,
            subtask: subtask.value
        }
    );

    await setItem('allTasks', JSON.stringify(allTasks));
}


function changePriority(priority) {
    switch (priority) {
        case 'urgent':
            changeColorUrgent();
            break;
        case 'medium':
            changeColorMedium();
            break;
        case 'low':
            changeColorLow();
            break;

    }
}


function showAndHideContacts() {
    console.log('in showAndHideContacts()');
    let contactBox = document.getElementById('add-task-contacts-to-assigne');

    if (contactBox.classList.contains('d-none')) {
        contactBox.classList.remove('d-none');
        contactBox.classList.add('d-block');
    } else if (contactBox.classList.contains('d-block')) {
        contactBox.classList.remove('d-block');
        contactBox.classList.add('d-none');
    }
}

function showAndHideCategories() {
    let taskBox = document.getElementById('add-task-category-dropdown');

    if (taskBox.classList.contains('d-none')) {
        taskBox.classList.remove('d-none');
        taskBox.classList.add('d-block');
    } else if (taskBox.classList.contains('d-block')) {
        taskBox.classList.remove('d-block');
        taskBox.classList.add('d-none');
    }
}

function clearForm() {
    document.getElementById('add-task-title').value = '';
    document.getElementById('add-task-description').value = '';
    document.getElementById('add-task-date').value = '';
    document.getElementById('add-task-subtask').value = '';
}



// these functions have to be combined
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