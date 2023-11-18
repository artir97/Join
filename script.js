let contacts = [
    {
        'name': 'Anton Mayer',
        'email': 'anton@gmail.com',
        'phone': 49111111111
    },
    {
        'name': 'Anja Schulz',
        'email': 'schulz@hotmail.com',
        'phone': 49111111111
    },
    {
        'name': 'Benedikt Ziegler',
        'email': 'benedikt@gmail.com',
        'phone': 49111111111
    },
    {
        'name': 'David Eisenberg',
        'email': 'davidberg@gmail.com',
        'phone': 49111111111
    },
    {
        'name': 'Eva Fischer',
        'email': 'eva@gmail.com',
        'phone': 49111111111
    },
    {
        'name': 'Emmanuel Mauer',
        'email': 'emmanuelma@gmail.com',
        'phone': 49111111111
    },
    {
        'name': 'Marcel Bauer',
        'email': 'bauer@gmail.com',
        'phone': 49111111111
    },
    {
        'name': 'Tatjana Wolf',
        'email': 'wolf@gmail.com',
        'phone': 49111111111
    },
]



async function init(){
    await includeHTML();
    setTimeout(loadimg, 800);
}


function loadimg(){
    let container = document.getElementById('logo-container');
    let img = document.getElementById('logo-img');
    img.src = 'assets/img/logo_blue.png';
    img.style.top = '10%';
    img.style.left = '5%';
    container.style.backgroundColor = "white"; 
    document.getElementById('login-container').style.display = 'flex';
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
function addNewContact(){

}