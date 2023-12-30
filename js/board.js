let loadedTasks= [];

let toDo = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];


async function loadedTaskstoBoard() {
    const loadTasks = await getItem('allTasks');
    loadedTasks = JSON.parse(loadTasks);
}


function getToDoTasks (tasks){
    toDo = tasks.filter(t => t['boardContainer'] == 'toDo');
    console.log('ToDo:', toDo);

    inProgress = tasks.filter(t => t['boardContainer'] == 'inProgress');
    console.log('inProgress:', inProgress);

    awaitFeedback = tasks.filter(t => t['boardContainer'] == 'aweitFeedback');
    console.log('awaitFeedback:', awaitFeedback);

    done = tasks.filter(t => t['boardContainer'] == 'done');
    console.log('done:', done);
}



function closeAddTaskForm(){
    document.getElementById('slide-form-add-task').style.display = 'none';
}

function openAddTaskForm(){
    document.getElementById('slide-form-add-task').style.display = 'block';

}

let currentDraggedElement;

async function updateHTML() {
    await loadedTaskstoBoard();
    getToDoTasks (loadedTasks)
    initTaskData();
    renderToDoTask(toDo);
    renderInProgressTask(inProgress);
    renderAwaitFeedbackTask(awaitFeedback);
    renderDoneTask(done);    
}


async function renderToDoTask() {    
    // let open = tasks.filter(t => t['boardContainer'] == 'toDo');
    const container = document.getElementById('todoListContainer');
    container.innerHTML = '';
    
    if (toDo.length > 0) {
        for (let index = 0; index < toDo.length; index++) {
            let element = toDo[index];
            container.innerHTML += generateTodoHTML(element, index, toDo);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }

}


function generateTodoHTML(element, index) {
   
    let assignedContactHTML = '';
    if (element.assignedContact && element.assignedContact.length > 0) {
        for (let i = 0; i < element.assignedContact.length; i++) {
            let contact = element.assignedContact[i];
            assignedContactHTML += `
                <div class="boardNameBox">
                    ${getInitials(contact.name)}
                </div>`;
        }
    }

    return /*html*/`
        <div draggable="true" onclick="openTaskPopup(${index}, toDo)" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="category">${getFirstLettersUppercase(element['category'])}</div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div id="selectContact" class="selectContact">
                ${assignedContactHTML}
            </div>            
        </div>`;
}


function renderInProgressTask(){
    container = document.getElementById('progressListContainer');
    container.innerHTML = '';

    if (inProgress.length > 0) {
        for (let index = 0; index < inProgress.length; index++) {
            let element = inProgress[index];
            container.innerHTML += generateInProgressTaskHTML(element, index, inProgress);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}


function generateInProgressTaskHTML(element, index) {
   
    let assignedContactHTML = '';
    if (element.assignedContact && element.assignedContact.length > 0) {
        for (let i = 0; i < element.assignedContact.length; i++) {
            let contact = element.assignedContact[i];
            assignedContactHTML += `
                <div class="boardNameBox">
                    ${getInitials(contact.name)}
                </div>`;
        }
    }

    return /*html*/`
        <div draggable="true" onclick="openTaskPopup(${index}, inProgress)" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="category">${getFirstLettersUppercase(element['category'])}</div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div id="selectContact" class="selectContact">
                ${assignedContactHTML}
            </div>            
        </div>`;
}






function renderAwaitFeedbackTask(){
    // let awaitFeedback = tasks.filter(t => t['boardContainer'] == 'aweitFeedback');

    container = document.getElementById('awaitFeedbackListContainer');
    container.innerHTML = '';

    if (awaitFeedback.length > 0) {
        for (let index = 0; index < awaitFeedback.length; index++) {
            let element = awaitFeedback[index];
            document.getElementById('awaitFeedbackListContainer').innerHTML += generateAwaitFeedbackHTML(element, index);
            }
    } else {
        generateEmtyTodoHTML(container);
    }
}



function generateAwaitFeedbackHTML(element, index) {
   
    let assignedContactHTML = '';
    if (element.assignedContact && element.assignedContact.length > 0) {
        for (let i = 0; i < element.assignedContact.length; i++) {
            let contact = element.assignedContact[i];
            assignedContactHTML += `
                <div class="boardNameBox">
                    ${getInitials(contact.name)}
                </div>`;
        }
    }

    return /*html*/`
        <div draggable="true" onclick="openTaskPopup(${index}, awaitFeedback)" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="category">${getFirstLettersUppercase(element['category'])}</div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div id="selectContact" class="selectContact">
                ${assignedContactHTML}
            </div>            
        </div>`;
}




function renderDoneTask(){
    // let done = tasks.filter(t => t['boardContainer'] == 'done');

    container = document.getElementById('doneListContainer');
    container.innerHTML = '';

    if (done.length > 0) {
        for (let index = 0; index < done.length; index++) {
            let element = done[index];
            document.getElementById('doneListContainer').innerHTML += generateDoneHTML(element, index);
            }
    } else {
        generateEmtyTodoHTML(container);
    }
}


function generateDoneHTML(element, index) {
   
    let assignedContactHTML = '';
    if (element.assignedContact && element.assignedContact.length > 0) {
        for (let i = 0; i < element.assignedContact.length; i++) {
            let contact = element.assignedContact[i];
            assignedContactHTML += `
                <div class="boardNameBox">
                    ${getInitials(contact.name)}
                </div>`;
        }
    }

    return /*html*/`
        <div draggable="true" onclick="openTaskPopup(${index}, done)" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="category">${getFirstLettersUppercase(element['category'])}</div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div id="selectContact" class="selectContact">
                ${assignedContactHTML}
            </div>            
        </div>`;
}


function getFirstLettersUppercase(text) {
    if (!text) return '';
    return text.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}



function getInitials(fullName) {
    // Splitte den Namen in Vor- und Nachnamen
    const nameParts = fullName.split(' ');

    // Extrahiere den ersten Buchstaben jedes Teils und setze sie zusammen
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials;
    
}


function generateEmtyTodoHTML(){   
        container.innerHTML = /*html*/`               
        <div class="emtyTask">
           <p>No tasks To do</p>            
        </div>`;
}


function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    updateHTML();
}

function openTaskPopup(index, taskArray) {
    const element = taskArray[index];

    let assignedContactHTML = '';
    if (element.assignedContact.length > 0) {
        for (let i = 0; i < element.assignedContact.length; i++) {
            const contact = element.assignedContact[i];
            assignedContactHTML += `
                <div class="singleContactPopup">
                    <div class="boardNameBox">${getInitials(contact.name)}</div>
                    ${contact.name}
                </div>`;
        }
    }


    let subtaskHTML = '';
    if (element.subtask.length > 0) {
        for (let i = 0; i < element.subtask.length; i++) {
            const subtask = element.subtask[i];
            subtaskHTML += `
                <div class="singleContactPopup">
                    ${subtask}
                </div>`;
        }
    }




    const popupContent = /*html*/`
        <div class="popup editTaskContainerBoard" onclick="closeTaskPopup()">
            <div class="popup-content editTask" onclick="doNotClose(event)">
                <div class="spacebetween pointer">
                    <div class="category">${getFirstLettersUppercase(element['category'])}</div>
                    <div onclick="closeTaskPopup()">
                        <img src="assets/img/close.png" alt="">
                    </div>
                </div>
                <h1 class="popupTaskTitel">${element['title']}</h1>                
                <p class="popupTaskDescription">${element['description']}</p>
                <p class="popupTaskDescription">Due date: ${element['date']}</p>
                <p class="popupTaskDescription">Priority: ${element['priority']}</p>
                <div id="selectContact" class="selectContactPopup">
                    <p>Assigned To:</p>
                    <div class="assignedSubtasksContainer">
                        ${assignedContactHTML}
                    </div>
                </div>
                <div id="selectContact" class="selectContactPopup">
                <p>Subtasks </p>
                    <div class="assignedSubtasksContainer">
                        ${subtaskHTML}
                    </div>
                </div>

                <div class="editButtonContainer">
                    <div class="editButton">
                        <img src="assets/img/delete.png" alt="">
                        <p>Delete </p> 
                    </div> 
                    <p>|</p>
                    <div class="editButton">
                        <img src="assets/img/delete.png" alt="">
                        <p>Edit</p>
                    </div>
                </div>

            </div>
        </div>`;

    const popupContainer = document.createElement('div');
    popupContainer.innerHTML = popupContent;

    document.body.appendChild(popupContainer);
}


function closeTaskPopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
        popup.remove();
       
    }
}

function doNotClose(event) {
    event.stopPropagation();
}
