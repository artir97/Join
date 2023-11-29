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
        contactsList.innerHTML += contactList(contact, i);
    }
}

function contactList(contact, i){
    let firstLetter = contact['name'].charAt(0).toUpperCase();
    let uppercaseLetters = (str) => {return str.split('').filter(char => /[A-Z]/.test(char));};
    const uppercaseLetter = uppercaseLetters(contact['name']).join('');
    if (contactList.lastFirstLetter === undefined || contactList.lastFirstLetter !== firstLetter) {
        contactList.lastFirstLetter = firstLetter;
        return `
            <div class="firstLetter">${firstLetter}</div>
            ${contactInfo(contact, uppercaseLetter, i)}
        `;
    } else {
        return `
            ${contactInfo(contact, uppercaseLetter, i)}
        `;
    }
}

function contactInfo(contact, uppercaseLetter, i){
    return `
        <div class="spacer">
        <svg xmlns="http://www.w3.org/2000/svg" width="353" height="2" viewBox="0 0 353 2" fill="none">
        <path d="M0.5 1H352.5" stroke="#D1D1D1" stroke-linecap="round"/>
        </svg>
        </div>
        <div class="contactInfo" id="contactInfo${i}" onclick="openContactView(${i})">
        <div class="profileBadge">
                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                    <circle cx="21.5" cy="21" r="20" fill="#FF7A00" stroke="white" stroke-width="2"/>
                    <text font-size="12px" text-anchor="middle" x="50%" y="50%" fill="white" stroke-width="0.1px" dy=".3em">${uppercaseLetter}</text>
                </svg>
                </div>
                <h2 id="contactName${i}">${contact['name']} <p id="contactMail${i}">${contact['email']}</p></h2>
            </div>
    `
}

function openContactView(i){
    let contactView = document.getElementById('contactView');
    contactView.innerHTML = '';
    // contactView.style.display =   ; //anmation
    const contact = contacts[i];
    let name = contact['name'];
    let email = contact['email'];
    let phone = contact['phone'];
    
    let uppercaseLetters = (str) => {return str.split('').filter(char => /[A-Z]/.test(char));};
    const uppercaseLetter = uppercaseLetters(contacts[i]['name']).join('');
    
    contactView.innerHTML += renderContactView(i, name, email, phone, uppercaseLetter); 
    changeContactColor(i);
}


function renderContactView(i, name, email, phone, uppercaseLetter){
    return `
    <div class="contacts-top">
    <div class="profileBadge contactViewBadge">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        viewBox="0 0 43 42"
        fill="none"
      >
        <circle
          cx="21.5"
          cy="21"
          r="20"
          fill="#FF7A00"
          stroke="white"
          stroke-width="2"
        />
        <text id="profileBadge"
          font-size="20px"
          text-anchor="middle"
          x="50%"
          y="50%"
          fill="white"
          stroke-width="0.1px"
          dy=".3em"
        >
          ${uppercaseLetter}
        </text>
      </svg>
    </div>
    <div class="profileName">
      <h1 id="profileName">${name}</h1>
      <div class="profileActions">
        <button class="profileEdit" onclick="editContact(${i})">
          <img src="assets/img/edit.png" alt="" /> Edit
        </button>
        <button class="profileDel" onclick="delContact(${i})">
          <img src="assets/img/delete.png" alt="" /> Delete
        </button>
      </div>
    </div>
  
  </div>
  <h2>Contact Information</h2>
    <div class="contactMailPhone">
      <div class="contactEmail">
          <h3>Email</h3>
          <p id="profileEmail">${email}</p>
      </div>
      <div class="contactPhone"> 
          <h3>Phone</h3>
          <p id="profilePhone">+${phone}</p>
      </div>
    </div> `
}

function changeContactColor(i){
    for (let index = 0; index < contacts.length; index++) {
        const contactElement = document.getElementById(`contactInfo${index}`);
        const nameElement = document.getElementById(`contactName${index}`);
        const mailElement = document.getElementById(`contactMail${index}`);
        if (index === i) {
            contactElement.classList.add('blueColor');
            nameElement.classList.add('whiteColor');
            mailElement.classList.add('whiteColor');
        } else {
            contactElement.classList.remove('blueColor');
            nameElement.classList.remove('whiteColor');
            mailElement.classList.remove('whiteColor');
        }
    }
}

function editContact(i){
    // open edit contact
}

function delContact(i){
    let contactView = document.getElementById('contactView');
    contactView.innerHTML = '';
    contacts.splice(i);
    init();
}