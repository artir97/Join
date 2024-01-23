//zum verkürzen von board.js

/**
 * Renders the "To Do" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the toDo Tasks.
 */
async function renderToDoTask(loadedTasks) {    
    let open = loadedTasks.filter(t => t['status'] == 'toDo');
    let container = document.getElementById('todoListContainer');
    container.innerHTML = '';
    
    if (open.length > 0) {
        for (let index = 0; index < open.length; index++) {
            let element = open[index];
            let elementID = open[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}


/**
 * Renders the "In Progress" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the inProgress Tasks.
 */
function renderInProgressTask(loadedTasks){
    let inProgress = loadedTasks.filter(t => t['status'] == 'inProgress');
    let container = document.getElementById('progressListContainer');
    container.innerHTML = '';   

    if (inProgress.length > 0) {
        for (let index = 0; index < inProgress.length; index++) {
            let element = inProgress[index];
            let elementID = inProgress[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}


/**
 * Renders the "Await Feedback" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the aweitFeedback Tasks.
 */
function renderAwaitFeedbackTask(loadedTasks){
    let awaitFeedback = loadedTasks.filter(t => t['status'] == 'aweitFeedback');
    let container = document.getElementById('awaitFeedbackListContainer');
    container.innerHTML = '';

    if (awaitFeedback.length > 0) {
        for (let index = 0; index < awaitFeedback.length; index++) {
            let element = awaitFeedback[index];
            let elementID = awaitFeedback[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
            }
    } else {
        generateEmtyTodoHTML(container);
    }
}


/**
 * Renders the "Done" tasks on the board.
 * @param {Array} loadedTasks - The array of tasks to filte the done Tasks.
 */
function renderDoneTask(loadedTasks){
    let done = loadedTasks.filter(t => t['status'] == 'done');
    let container = document.getElementById('doneListContainer');
    container.innerHTML = '';

    if (done.length > 0) {
        for (let index = 0; index < done.length; index++) {
            let element = done[index];
            let elementID = done[index].taskID;
            container.innerHTML += generateTodoHTML(element, elementID);
            }
    } else {
        generateEmtyTodoHTML(container);
    }
}