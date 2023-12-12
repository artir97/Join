function closeAddTaskForm(){
    document.getElementById('slide-form-add-task').style.display = 'none';
}

function openAddTaskForm(){
    document.getElementById('slide-form-add-task').style.display = 'block';

}


let todos = [{
    'id': 0,
    'title': 'Putzen',
    'category': 'todoListContainer'
}, {
    'id': 1,
    'title': 'Kochen',
    'category': 'todoListContainer'
}, {
    'id': 2,
    'title': 'Einkaufen',
    'category': 'progressListContainer'
}, {
    'id': 3,
    'title': 'Lesen',
    'category': 'progressListContainer'
}, {
    'id': 4,
    'title': 'Schreiben',
    'category': 'awaitFeedbackListContainer'
}, {
    'id': 5,
    'title': 'Hausaufgaben',
    'category': 'awaitFeedbackListContainer'
}
];



let currentDraggedElement;

function updateHTML() {
    updateToDo();
    updateInProgress();
    updateDone();
    updateAwaitFeedback();
        document.getElementById('contactsPage').classList.remove('active');
        document.getElementById('summaryPage').classList.remove('active');
        document.getElementById('taskPage').classList.remove('active');
        document.getElementById('boardPage').classList.add('active');

}

function updateToDo() {
    let open = todos.filter(t => t['category'] == 'todoListContainer');
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
}

function updateInProgress(){
    let closed = todos.filter(t => t['category'] == 'progressListContainer');
    container = document.getElementById('progressListContainer');
    container.innerHTML = '';
    if (closed.length > 0) {
        for (let index = 0; index < closed.length; index++) {
            const element = closed[index];
            container.innerHTML += generateTodoHTML(element);
        }        
    } else {
        generateEmtyTodoHTML(container);
    }
}

function updateAwaitFeedback(){
    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedbackListContainer');
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

function updateDone(){
    let done = todos.filter(t => t['category'] == 'doneListContainer');
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


function startDragging(id) {
    console.log('Ziehen wurde für das Element mit der ID gestartet:', id);
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return /*html*/`
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
            <div class="category">Technical task</div>
            <div class="taskName">${element['title']}</div>
            <div class="taskInfo">Create reusable HTML base templates...</div>
            <div class="selectContact">
                <div class="boardNameBox">CH</div>
                <div class="boardNameBox">AF</div>
                <div class="boardNameBox">GT</div>
            </div>
            
        </div>`;
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