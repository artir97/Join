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
}];

let currentDraggedElement;

function updateHTML() {
    let open = todos.filter(t => t['category'] == 'todoListContainer');

    document.getElementById('todoListContainer').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('todoListContainer').innerHTML += generateTodoHTML(element);
    }

    let closed = todos.filter(t => t['category'] == 'progressListContainer');

    document.getElementById('progressListContainer').innerHTML = '';

    for (let index = 0; index < closed.length; index++) {
        const element = closed[index];
        document.getElementById('progressListContainer').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(id) {
    console.log('Ziehen wurde für das Element mit der ID gestartet:', id);
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`;
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