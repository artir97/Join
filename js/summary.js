async function summaryInit(){
    await loadedTaskstoBoard();
    countAllTasks ();
    countAllToDOs ();
    countAllInProgress ();
    countAllAwaitFeedback ();
    countAllDone ();
    countTaskUrgent();
    document.getElementById('currentDateContainer').innerText = getCurrentDate();
}


function countAllTasks (){
    let summaryAllTasks = document.getElementById('taskInBoard');   
    summaryAllTasks.innerHTML = /*html*/`
        ${loadedTasks.length}
    `;
}


function countAllToDOs (){
    let toDO = loadedTasks.filter(t => t['status'] == 'toDo'); 
    let summarytoDos = document.getElementById('toDoInBoard'); 
    summarytoDos.innerHTML = /*html*/`
        ${toDO.length}
    `;
}


function countAllInProgress (){
    let inProgress = loadedTasks.filter(t => t['status'] == 'inProgress'); 
    let summaryinProgress = document.getElementById('inProgressInBoard'); 
    summaryinProgress.innerHTML = /*html*/`
        ${inProgress.length}
    `;
}


function countAllAwaitFeedback (){
    let awaitFeedback = loadedTasks.filter(t => t['status'] == 'aweitFeedback'); 
    let summaryawaitFeedback = document.getElementById('awaitFeedbackInBoard'); 
    summaryawaitFeedback.innerHTML = /*html*/`
        ${awaitFeedback.length}
    `;
}


function countAllDone (){
    let done = loadedTasks.filter(t => t['status'] == 'done');
    let summaryDone = document.getElementById('doneInBoard'); 
    summaryDone.innerHTML = /*html*/`
        ${done.length}
    `;
}



function countTaskUrgent(){
    let tasksUrgent = loadedTasks.filter(t => t['priority'] == 'urgent'); 
    let summaryTasksUrgent = document.getElementById('urgentInBoard'); 
    summaryTasksUrgent.innerHTML = /*html*/`
        ${tasksUrgent.length}
    `;
}


function redirectToBoard() {
    window.location.href = '/board.html';
}

function getCurrentDate() {
    const currentDate = new Date();    
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    return formattedDate;
}