let loadedTasks= [];


async function loadedTaskstoBoard() {
    const loadTasks = await getItem('allTasks');
    loadedTasks = JSON.parse(loadTasks);
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
    initTaskData();
    updateToDo(loadedTasks);
    updateInProgress(loadedTasks);
    updateAwaitFeedback(loadedTasks);
    updateDone(loadedTasks);    
}


async function updateToDo(loadedTasks) {    
    let open = loadedTasks.filter(t => t['boardContainer'] == 'toDo');
        
    container = document.getElementById('todoListContainer');
    container.innerHTML = '';

    if (open.length > 0) {
        for (let index = 0; index < open.length; index++) {
            const element = open[index];
            container.innerHTML += generateTodoHTML(element);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }

    console.log(open);
}


function updateInProgress(loadedTasks){
    let inProgress = loadedTasks.filter(t => t['boardContainer'] == 'inProgress');

    container = document.getElementById('progressListContainer');
    container.innerHTML = '';

    if (inProgress.length > 0) {
        for (let index = 0; index < inProgress.length; index++) {
            const element = inProgress[index];
            container.innerHTML += generateTodoHTML(element);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}

function updateAwaitFeedback(loadedTasks){
    let awaitFeedback = loadedTasks.filter(t => t['boardContainer'] == 'aweitFeedback');

    container = document.getElementById('awaitFeedbackListContainer');
    container.innerHTML = '';

    if (awaitFeedback.length > 0) {
        for (let index = 0; index < awaitFeedback.length; index++) {
            const element = awaitFeedback[index];
            document.getElementById('awaitFeedbackListContainer').innerHTML += generateTodoHTML(element);
        }
    } else {
        generateEmtyTodoHTML(container);
    }
}

function updateDone(loadedTasks){
    let done = loadedTasks.filter(t => t['boardContainer'] == 'done');

    container = document.getElementById('doneListContainer');
    container.innerHTML = '';

    if (done.length > 0) {
        for (let index = 0; index < done.length; index++) {
            const element = done[index];
            document.getElementById('doneListContainer').innerHTML += generateTodoHTML(element);
        }
    } else {
        generateEmtyTodoHTML(container);
    }
     
    
}


function generateTodoHTML(element) {
    // Funktion zum Extrahieren der Anfangsbuchstaben und Großschreibung für jedes Wort
    function getFirstLettersUppercase(text) {
        if (!text) return '';

        // Entferne eventuelles Minuszeichen und setze den Anfangsbuchstaben jedes Worts groß
        return text.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    return /*html*/`
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="category">${getFirstLettersUppercase(element['category'])}</div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">${element['description']}</div>
            <div id="selectContact" class="selectContact">
                ${element.assignedContact ? element.assignedContact.map(contact =>`
                    <div class="boardNameBox">
                        ${getInitials(contact.name)}
                    </div>
                `).join('') : ''}                
            </div>            
        </div>`;
}


// function generateTodoHTML(element) {
//     return /*html*/`
//         <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
//             <div class="category">${element['category'].charAt(0).toUpperCase()}</div>
//             <!-- <div class="category">${element['category']}</div> -->
//             <div class="taskName">${element['title']}</div>
//             <div class="taskInfo">${element['description']}</div>
//             <div id="selectContact" class="selectContact">
//             ${element.assignedContact ? element.assignedContact.map(contact =>`
//                     <div class="boardNameBox">
//                         ${getInitials(contact.name)}
                        
//                     </div>
//                 `).join('') : ''}                
                
//             </div>            
//         </div>`;
// }



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

// function highlight(id) {
//     document.getElementById(id).classList.add('drag-area-highlight');
// }

// function removeHighlight(id) {
//     document.getElementById(id).classList.remove('drag-area-highlight');
// }