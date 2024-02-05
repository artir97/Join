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


/**
 * Handles the click event for assigning task priority and updates the selected priority.
 * @param {string} priority - The priority level to be assigned ('urgent', 'medium', 'low').
 * @returns {string} - The updated priority level ('urgent', 'medium', 'low', or 'none').
 */
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
