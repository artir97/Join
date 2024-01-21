async function summaryInit(){
    await loadedTaskstoBoard();
    countAllTasks ();
    countAllToDOs ();
    countAllInProgress ();
    countAllAwaitFeedback ();
    countAllDone ();
    countTaskUrgent();
    getCurrentDate();
    // document.getElementById('currentDateContainer').innerText = getCurrentDate();
}


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


function redirectToBoard() {
    window.location.href = '/board.html';
}

function getCurrentDate() {
    const currentDate = new Date();    
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('currentDateContainerMobile').innerText = formattedDate;
    document.getElementById('currentDateContainer').innerText = formattedDate;
    // return formattedDate;
}