let originalContainer = null;
let originalElement = null;

/**
 * Initiates dragging of an element.
 *  Clone original element for dragging
 * @param {number} elementID - The ID of the element being dragged.
 */
function startDragging(elementID) {
    dragElement = loadedTasks.filter(id => id['taskID'] == elementID);
    currentDraggedElement = dragElement[0];
    currentDraggedElementID = dragElement[0].taskID;

    let currentDraggedElementRotate = document.getElementById(elementID);
    
    if (currentDraggedElementRotate) {
        currentDraggedElementRotate.classList.add('dragging'); 
        originalContainer = currentDraggedElementRotate.parentElement; 
        originalElement = currentDraggedElementRotate.cloneNode(true); 
        originalElement.classList.remove('dragging'); 
        originalContainer.appendChild(originalElement);
        originalElement.classList.add('rotate-15');
    }
}

/**
 * Ends dragging of an element.
 * Remove original element from original container
 */
function endDragging() {
    if (currentDraggedElementID) {
        let currentDraggedElementRotate = document.getElementById(currentDraggedElementID);
        if (currentDraggedElementRotate) {
            currentDraggedElementRotate.classList.remove('dragging');
            if (originalElement && originalElement.parentNode === originalContainer) {
                originalContainer.removeChild(originalElement);
            }
        }
    }
}

/**
 * Moves a task to a specified category.
 * @param {string} category - The target category.
 * checks if ID is already there, if so refreshes, if not it adds to it
 */
async function moveTo(category) {
    if (currentDraggedElement) {
        const elementID = currentDraggedElement.taskID;
        currentDraggedElement["status"] = category;
        const existingIndex = allTasks.findIndex(task => task.taskID === elementID);

        if (existingIndex !== -1) {
            allTasks[existingIndex] = currentDraggedElement;
        } else {
            allTasks.push(currentDraggedElement);
        }
        await setItem("allTasks", JSON.stringify(allTasks));
        await updateHTML();
    }
}

/**
 * Allows dropping of an element.
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
    const afterElement = getDragAfterElement(ev.currentTarget, ev.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        ev.currentTarget.appendChild(draggable);
    } else {
        ev.currentTarget.insertBefore(draggable, afterElement);
    }
}

/**
 * Returns the draggable element after the specified position.
 * @param {Element} container - The container element.
 * @param {number} y - The vertical position.
 * @returns {Element} - The draggable element after the specified position.
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


/**
 * Event listener for the DOMContentLoaded event.
 * Once the DOM is fully loaded, it gets the containers by their ids,
 * then adds dragenter, dragleave, and drop event listeners to each container.
 */
document.addEventListener("DOMContentLoaded", function() {
    const containers = [
        'todoListContainer',
        'progressListContainer',
        'awaitFeedbackListContainer',
        'doneListContainer'
    ].map(id => document.getElementById(id))
    .filter(el => el !== null);

    containers.forEach(container => {
        let counter = 0; // Add a counter
        container.addEventListener('dragenter', function(e) {
            e.preventDefault();
            counter++;
            this.classList.add('highlight');
        });
        container.addEventListener('dragleave', function(e) {
            e.preventDefault();
            counter--;
            if (counter === 0) {
                this.classList.remove('highlight');
            }
        });
        container.addEventListener('drop', function(e) {
            e.preventDefault();
            counter = 0;
            this.classList.remove('highlight');
        });
    });
});