console.log('test');

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
    // document.getElementById('add-task-urgent').style.backgroundColor = 'red';
    // document.getElementById('add-task-medium').style.backgroundColor = 'yellow';
    // document.getElementById('add-task-low').style.backgroundColor = 'green';
}


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