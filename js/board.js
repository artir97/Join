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
    'category': 'doneListContainer'
}
];



let currentDraggedElement;

function updateHTML() {
    updateToDo();
    updateInProgress();
    updateDone();
    updateAwaitFeedback();
}

function updateToDo() {
    let open = todos.filter(t => t['category'] == 'todoListContainer');

    document.getElementById('todoListContainer').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('todoListContainer').innerHTML += generateTodoHTML(element);
    }
}

function updateInProgress(){
    let closed = todos.filter(t => t['category'] == 'progressListContainer');

    document.getElementById('progressListContainer').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('progressListContainer').innerHTML += generateTodoHTML(element);
    }
}

function updateAwaitFeedback(){
    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedbackListContainer');
    document.getElementById('awaitFeedbackListContainer').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('awaitFeedbackListContainer').innerHTML += generateTodoHTML(element);
    }
}

function updateDone(){
    let done = todos.filter(t => t['category'] == 'doneListContainer');
    document.getElementById('doneListContainer').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('doneListContainer').innerHTML += generateTodoHTML(element);
    }
}


function startDragging(id) {
    console.log('Ziehen wurde für das Element mit der ID gestartet:', id);
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return /*html*/`
        <div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">
            <div>Technical task</div>
            <p>${element['title']}</p>
            <p>Create reusable HTML base templates...</p>
            
        </div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}