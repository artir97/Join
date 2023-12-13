let allContacts = [
  {
    name: "Anton Mayer",
    email: "anton@gmail.com",
    phone: 49111111111,
  },
  {
    name: "Anja Schulz",
    email: "schulz@hotmail.com",
    phone: 49111111111,
  },
  {
    name: "Benedikt Ziegler",
    email: "benedikt@gmail.com",
    phone: 49111111111,
  },
  {
    name: "David Eisenberg",
    email: "davidberg@gmail.com",
    phone: 49111111111,
  },
  {
    name: "Eva Fischer",
    email: "eva@gmail.com",
    phone: 49111111111,
  },
  {
    name: "Emmanuel Mauer",
    email: "emmanuelma@gmail.com",
    phone: 49111111111,
  },
  {
    name: "Marcel Bauer",
    email: "bauer@gmail.com",
    phone: 49111111111,
  },
];

let newContacts = [{
  name: 'Tatjana Wolf',
  email: 'wolf@gmail.com',
  phone: 4922222222}
 ];

let loadedContacts = [];

async function contactsInit() {
  saveContacts();
  await loadContacts();
  // document.getElementById('contactsPage').classList.add('active');
  // document.getElementById('summaryPage').classList.remove('active');
  // document.getElementById('taskPage').classList.remove('active');
  // document.getElementById('boardPage').classList.remove('active');
}

async function saveContacts() {
  const existingContactsString = await getItem("kontakte");
  const existingContacts = existingContactsString ? JSON.parse(existingContactsString) : [];
  await setItem("kontakte", JSON.stringify(existingContacts));
}

async function loadContacts() {
    const contactsString = await getItem("kontakte");
    if (contactsString) {
       loadedContacts = JSON.parse(contactsString);
            loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      contactsListRender(loadedContacts);
    }
}


async function contactsListRender(contacts) {
    let contactsList = document.getElementById("contacts");
    contactsList.innerHTML ='';
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      contactsList.innerHTML += contactList(contact, i);
    }
}

function contactList(contact, i) {
  let firstLetter = contact["name"].charAt(0).toUpperCase();
  let uppercaseLetters = (str) => {return str.split("").filter((char) => /[A-Z]/.test(char));};
  const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
  if (contactList.lastFirstLetter === undefined || contactList.lastFirstLetter !== firstLetter) {
    contactList.lastFirstLetter = firstLetter;
    return `<div class="firstLetter">${firstLetter}</div>
            ${contactInfo(contact, uppercaseLetter, i)}`;
  } else {
    return `${contactInfo(contact, uppercaseLetter, i)}`;
  }
}

function contactInfo(contact, uppercaseLetter, i) {
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
                <h2 id="contactName${i}">${contact["name"]} <p id="contactMail${i}">${contact["email"]}</p></h2>
            </div>
    `;
}

async function openContactView(i) {
  let contactView = document.getElementById("contactView");
  if (contactView.innerHTML.trim() !== "") {
    contactView.style = "left: 100%";
    removeWhiteColor();
    setTimeout(() => (contactView.innerHTML = ""), 200);
  } else {
      const contactsString = await getItem("kontakte");
      loadedContacts = JSON.parse(contactsString);
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      const contact = loadedContacts[i];
      let name = contact["name"];
      let email = contact["email"];
      let phone = contact["phone"];
      contactView.style = "left: 832px";
      let uppercaseLetters = (str) => str.split("").filter((char) => /[A-Z]/.test(char));
      const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
      contactView.innerHTML = "";
      contactView.innerHTML += renderContactView(i, name, email, phone, uppercaseLetter);
      changeContactColor(i);
  }
}

function renderContactView(i, name, email, phone, uppercaseLetter) {
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
    </div> `;
}

function changeContactColor(i) {
    const contactElement = document.getElementById(`contactInfo${i}`);
    const nameElement = document.getElementById(`contactName${i}`);
    const mailElement = document.getElementById(`contactMail${i}`);
      addWhiteColor(contactElement, nameElement, mailElement);
}

function addWhiteColor(contactElement, nameElement, mailElement){
  contactElement.classList.add("blueColor");
  nameElement.classList.add("whiteColor");
  mailElement.classList.add("whiteColor");
}

function removeWhiteColor(){
  let info = document.getElementsByClassName('contactInfo');
  for (let i = 0; i < info.length; i++) {
    let allInfos = info[i];
    const contactElement = document.getElementById(`contactInfo${i}`);
    const nameElement = document.getElementById(`contactName${i}`);
    const mailElement = document.getElementById(`contactMail${i}`);    
    contactElement.classList.remove("blueColor");
  nameElement.classList.remove("whiteColor");
  mailElement.classList.remove("whiteColor");
  }
}

function addNewContactWindow() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.style.display = "inline-flex";
  addNewContact.style = "right: 0";
  document.getElementById("popup-bg").style.display = "block";
}

function setContactValue(){
  let contactName = document.getElementById('addContactName');
  let contactEmail = document.getElementById('addContactEmail');
  let contactPhone = document.getElementById('addContactPhone');
  contactName.value  = newContacts[0]['name'];
  contactEmail.value = newContacts[0]['email'];
  contactPhone.value = newContacts[0]['phone'];
}

async function addContact(){
    let contactName = document.getElementById('addContactName').value;
    let contactEmail = document.getElementById('addContactEmail').value;
    let contactPhone = document.getElementById('addContactPhone').value;
    const newContact = {
      name: contactName,
      email: contactEmail,
      phone: contactPhone
    };
    const isNameDuplicate = loadedContacts.some(contact => contact.name.toLowerCase() === contactName.toLowerCase());
    if (isNameDuplicate) {
      console.log("Der Name existiert bereits im Adressbuch.");
      closeAddNewContact();
    } else {
      loadedContacts.push(newContact);
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      await setItem("kontakte", JSON.stringify(loadedContacts));
      contactsListRender(loadedContacts);
      closeAddNewContact();
      setTimeout(addContactSuccess, 800);
    }
}

function addContactSuccess(){
  let success = document.getElementById('newContactSuccess');
  success.style.top = '50%';
  setTimeout(addContactSuccessClose, 1600)
}
function addContactSuccessClose(){
  let success = document.getElementById('newContactSuccess');
  success.style.top = '120%';
}

let currentEditIndex; 

async function editContact(i) {
  const contactsString = await getItem("kontakte");
  loadedContacts = JSON.parse(contactsString);
  const contact = loadedContacts[i];
  let uppercaseLetters = (str) => {return str.split("").filter((char) => /[A-Z]/.test(char));};
  const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
  document.getElementById("popup-bg").style.display = "block";
  let editContact = document.getElementById("editContact");
  editContact.style = "left: 0";
  document.getElementById("editContactName").value = contact["name"];
  document.getElementById("editContactEmail").value = contact["email"];
  document.getElementById("editContactPhone").value = "+" + contact["phone"];
  document.getElementById("contactEditImage").innerHTML = uppercaseLetter;
  currentEditIndex = i;
}

async function saveChangeContact() {
  const editedIndex = currentEditIndex;
    const contactsString = await getItem("kontakte");
    loadedContacts = JSON.parse(contactsString);
    const editedContact = loadedContacts[editedIndex];
    const editedName = document.getElementById("editContactName").value;
    const editedEmail = document.getElementById("editContactEmail").value;
    const editedPhone = document.getElementById("editContactPhone").value;
    editedContact['name'] = editedName;
    editedContact['email'] = editedEmail;
    editedContact['phone'] = editedPhone;

    setItem("kontakte", JSON.stringify(loadedContacts));
    loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
    contactsListRender(loadedContacts);
    closeEditContact();
}

function delEditedContact(){
  const deletedIndex = currentEditIndex;
}

async function delContact(i) {
    const contactsString = await getItem("kontakte");
    loadedContacts = JSON.parse(contactsString);
    loadedContacts.splice(i, 1)[0];
    await setItem("kontakte", JSON.stringify(loadedContacts));
    contactsListRender(loadedContacts);
    let contactView = document.getElementById("contactView");
    contactView.innerHTML = "";
}

function closeAddNewContact() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.style = "left: 100%";
  document.getElementById("popup-bg").style.display = "none";
  document.getElementById('addContactName').value = '';
  document.getElementById('addContactEmail').value ='';
  document.getElementById('addContactPhone').value ='';
  
}

function closeEditContact() {
  let editContact = document.getElementById("editContact");
  editContact.style = "left: -100%";
  document.getElementById("popup-bg").style.display = "none";
  document.getElementById("editContactName").value = '';
  document.getElementById("editContactEmail").value = '';
  document.getElementById("editContactPhone").value = '';
}


document.addEventListener("DOMContentLoaded", function () {

  var popupBg = document.getElementById("popup-bg");

  if (popupBg) {
    popupBg.addEventListener("click", function (event) {
      event.stopPropagation();
      popupBg.style.display = "none";
      closeAddNewContact();
      closeEditContact();
    });
  }
});

// document.addEventListener("DOMContentLoaded", contactsInit);
