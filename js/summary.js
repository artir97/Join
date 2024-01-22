//intialize all dynamic functions
async function summaryInit(){
    await loadedTaskstoBoard();
    countAllTasks ();
    countAllToDOs ();
    countAllInProgress ();
    countAllAwaitFeedback ();
    countAllDone ();
    countTaskUrgent();
    getCurrentDate();
}

// summary of all tasks
function countAllTasks (){
    let summaryAllTasks = document.getElementById('taskInBoard');   
    let summaryAllTasksMobile = document.getElementById('summaryAllTasksMobile');   
    summaryAllTasks.innerHTML = /*html*/`
        ${loadedTasks.length}
    `;
    summaryAllTasksMobile.innerHTML = /*html*/`
    ${loadedTasks.length}
    `;
}

// summary of To Do tasks
function countAllToDOs (){
    let toDO = loadedTasks.filter(t => t['status'] == 'toDo'); 
    let summarytoDos = document.getElementById('toDoInBoard'); 
    let summarytoDosMobile = document.getElementById('toDoInBoardMobile'); 
    summarytoDos.innerHTML = /*html*/`
        ${toDO.length}
    `;

    summarytoDosMobile.innerHTML = /*html*/`
        ${toDO.length}
    `;

}

//summary of In Progress tasks
function countAllInProgress (){
    let inProgress = loadedTasks.filter(t => t['status'] == 'inProgress'); 
    let summaryinProgress = document.getElementById('inProgressInBoard'); 
    let summaryinProgressMoblie = document.getElementById('summaryinProgressMoblie'); 
    summaryinProgress.innerHTML = /*html*/`
        ${inProgress.length}
    `;
    summaryinProgressMoblie.innerHTML = /*html*/`
        ${inProgress.length}
    `;
}

// summary of Await Feedback tasks
function countAllAwaitFeedback (){
    let awaitFeedback = loadedTasks.filter(t => t['status'] == 'awaitFeedback'); 
    let summaryawaitFeedback = document.getElementById('awaitFeedbackInBoard'); 
    let summaryawaitFeedbackMoblie = document.getElementById('summaryawaitFeedbackMoblie'); 
    summaryawaitFeedback.innerHTML = /*html*/`
        ${awaitFeedback.length}
    `;
    summaryawaitFeedbackMoblie.innerHTML = /*html*/`
        ${awaitFeedback.length}
    `;
}

//summary of Done tasks
function countAllDone (){
    let done = loadedTasks.filter(t => t['status'] == 'done');
    let summaryDone = document.getElementById('doneInBoard'); 
    let summaryDoneMoblie = document.getElementById('summaryDoneMoblie'); 
    summaryDone.innerHTML = /*html*/`
        ${done.length}
    `;
    summaryDoneMoblie.innerHTML = /*html*/`
    ${done.length}
`;
}


// summary of Urgent tasks
function countTaskUrgent(){
    let tasksUrgent = loadedTasks.filter(t => t['priority'] == 'urgent'); 
    let summaryTasksUrgent = document.getElementById('urgentInBoard'); 
    let summaryTasksUrgentMobile = document.getElementById('summaryTasksUrgentMobile'); 
    summaryTasksUrgent.innerHTML = /*html*/`
        ${tasksUrgent.length}
    `;
    summaryTasksUrgentMobile.innerHTML = /*html*/`
        ${tasksUrgent.length}
    `;
}

// directs user to give html
function redirectToBoard() {
    window.location.href = '/board.html';
}

// get current Date and shows on summary
function getCurrentDate() {
    const currentDate = new Date();    
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('currentDateContainerMobile').innerText = formattedDate;
    document.getElementById('currentDateContainer').innerText = formattedDate;
}