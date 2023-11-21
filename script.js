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
    contactsListRender();
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


function contactsListRender(){
    let contactsList = document.getElementById('contacts');
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        contactsList.innerHTML += contactList(contact);
    }
}

function contactList(contact){
    let firstLetter = contact['name'].charAt(0).toUpperCase();
    if (contactList.lastFirstLetter === undefined || contactList.lastFirstLetter !== firstLetter) {
        contactList.lastFirstLetter = firstLetter;
        return `
            <div class="firstLetter">${firstLetter}</div>
            ${contactInfo(contact, firstLetter)}
        `;
    } else {
        return `
            ${contactInfo(contact, firstLetter)}
        `;
    }
}

function contactInfo(contact){
    let uppercaseLetters = (str) => {return str.split('').filter(char => /[A-Z]/.test(char));};
    const uppercaseLetter = uppercaseLetters(contact['name']).join('');
    return `
        <div class="spacer">
        <svg xmlns="http://www.w3.org/2000/svg" width="353" height="2" viewBox="0 0 353 2" fill="none">
        <path d="M0.5 1H352.5" stroke="#D1D1D1" stroke-linecap="round"/>
        </svg>
        </div>
        <div class="contactInfo">
        <div class"profileBadge">
            ${uppercaseLetter}
                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                    T<circle cx="21.5" cy="21" r="20" fill="#FF7A00" stroke="white" stroke-width="2"/>
                </svg>
                </div>
                <h2>${contact['name']} <p>${contact['email']}</p></h2>
            </div>
    `
}