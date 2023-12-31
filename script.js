setTimeout(loadimg, 1000);

async function init() {
    await includeHTML();
    //Timeout war 800
    CheckIfLoggedInOrGuest();
    checkFocusOnSidenav()
}

function checkFocusOnSidenav(){
    if (document.location.pathname.includes("contacts.html")){
        document.getElementById('contactsPage').classList.add('active');
    } if (document.location.pathname.includes("add_task.html")){
        document.getElementById('taskPage').classList.add('active');
    } if (document.location.pathname.includes("board.html")){
        document.getElementById('boardPage').classList.add('active');
    } if (document.location.pathname.includes("summary.html")) {
        document.getElementById('summaryPage').classList.add('active');
    }
}

function loadimg() {
    let container = document.getElementById('logo-container');
    let img = document.getElementById('logo-img');
    img.style.top = '5%';
    img.style.left = '5%';
    img.style.transform = 'unset';
    if (document.location.pathname.includes("index.html")) {
        img.src = 'assets/img/logo_blue.png';
        container.style.zIndex = '8';
        container.style.backgroundColor = "white";
        document.getElementById('login-container').style.display = 'flex'; 
    }
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function showNavDropDown(){
    let dropdown = document.getElementById('navbar-dropdown');
    
    if(dropdown.classList.contains('d-none')){
        dropdown.classList.remove('d-none');
    }else{
        dropdown.classList.add('d-none');
    }
    
}

async function CheckIfLoggedInOrGuest() {
    let cookies = document.cookie.split(';');
    let loggedInUserCookie = cookies.find(cookie => cookie.trim().startsWith('loggedInUser='));

    if (loggedInUserCookie) {
        loggedInUser = JSON.parse(decodeURIComponent(loggedInUserCookie.split('=')[1]));
        // User is logged in, update UI accordingly
        document.getElementById('user-initials').innerHTML = `<div>${returnInitials(loggedInUser.user_name)}</div>`;
        document.getElementById('summary-headline').innerHTML = `${checkTimeOfDay()}, ${loggedInUser.user_name}`;
    } else {
        // No user is logged in
        document.getElementById('user-initials').innerHTML = '<div>G</div>';
        document.getElementById('summary-headline').innerHTML = `${checkTimeOfDay()}`;
    }
}

function checkTimeOfDay() {
    let currentDate = new Date();
    let currentHour = currentDate.getHours();

    if (currentHour >= 6 && currentHour < 12) {
        return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        return 'Good Day';
    } else {
        return 'Good Evening';
    }
}

function returnInitials(name){
    let names = name.split(' ');
    let initials = '';

    for (let name of names) {
        initials += name.charAt(0).toUpperCase();
    }
    return initials;
}

function logout() {
    // Set the expiration date of the cookie to a date in the past
    document.cookie = 'loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Redirect to the startpage
    window.location.href = 'index.html';
}
