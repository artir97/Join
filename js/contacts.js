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

// Initiate body onload
async function contactsInit() {
  await saveContacts();
  await loadContacts();
}

// save actual Contacts
async function saveContacts() {
  const existingContactsString = await getItem("kontakte");
  const existingContacts = existingContactsString ? JSON.parse(existingContactsString) : [];
  await setItem("kontakte", JSON.stringify(existingContacts));
}

// load contacts from storage
async function loadContacts() {
    const contactsString = await getItem("kontakte");
    if (contactsString) {
      loadedContacts = JSON.parse(contactsString);
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      contactsListRender(loadedContacts);
    }
}


// render ContactList into HTML
async function contactsListRender(contacts) {
    let contactsList = document.getElementById("contacts");
    contactsList.innerHTML ='';
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      contactsList.innerHTML += contactList(contact, i);
    }
}

// get first uppercase letter from name, aswell from last name, then return HTML
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

// contactlist HTML
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

// if Contact Info is open -> close, else render when clicked on a contact
async function openContactView(i) {
  let contactView = document.getElementById("contactView");
  if (contactView.innerHTML.trim() !== "") {
    contactView.classList.add('contactViewOff');
    contactView.classList.remove('contactViewOn');
    document.getElementById('mobileOptions').classList.remove("mobileOptionsOn");
    removeWhiteColor();
    setTimeout(() => (contactView.innerHTML = ""), 200);
  } else {
    document.getElementById('mobileOptions').classList.add("mobileOptionsOn");
      const contactsString = await getItem("kontakte");
      loadedContacts = JSON.parse(contactsString);
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      const contact = loadedContacts[i];
      let name = contact["name"];
      let email = contact["email"];
      let phone = contact["phone"]; 
      contactView.classList.add('contactViewOn');
      contactView.classList.remove('contactViewOff');
      let uppercaseLetters = (str) => str.split("").filter((char) => /[A-Z]/.test(char));
      const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
      contactView.innerHTML = "";
      contactView.innerHTML += renderContactView(i, name, email, phone, uppercaseLetter);
      changeContactColor(i);
      currentEditIndex = i;
  }
}

// contact info render html
function renderContactView(i, name, email, phone, uppercaseLetter) {
  return `
        <div class="mobileBackArrow" onclick="openContactView(${i})">
          <img src="assets/img/arrow-left-line.png" alt="">
        </div>
    <div class="contacts-top">
    <h2>Contact Information</h2>
    <div class="contactsProfileTop">
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
          <img src="assets/img/edit.png" alt=""/> Edit
        </button>
        <button class="profileDel" onclick="delContact(${i})">
          <img src="assets/img/delete.png" alt=""/> Delete
        </button>
      </div>
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

// changes color when contactView is opened
function changeContactColor(i) {
    const contactElement = document.getElementById(`contactInfo${i}`);
    const nameElement = document.getElementById(`contactName${i}`);
    const mailElement = document.getElementById(`contactMail${i}`);
      addWhiteColor(contactElement, nameElement, mailElement);
}

// adds font color to clicked contactView element
function addWhiteColor(contactElement, nameElement, mailElement){
  contactElement.classList.add("blueColor");
  nameElement.classList.add("whiteColor");
  mailElement.classList.add("whiteColor");
}

//removes font color 
function removeWhiteColor(){
  let info = document.getElementsByClassName('contactInfo');
  for (let i = 0; i < info.length; i++) {
    const contactElement = document.getElementById(`contactInfo${i}`);
    const nameElement = document.getElementById(`contactName${i}`);
    const mailElement = document.getElementById(`contactMail${i}`);    3
    contactElement.classList.remove("blueColor");
  nameElement.classList.remove("whiteColor");
  mailElement.classList.remove("whiteColor");
  }
}

// opens Add New Contact Window popup
function addNewContactWindow() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.classList.add('addContactOn')
  document.getElementById("popup-bg").style.display = "block";
}

// responsive mobile options window for Edit and Delete button
function mobileOptionsWindow(){
  document.getElementById("popup-bg").style.display = "block";
  let window = document.getElementById('mobileOptionsWindow');
  window.style.display = "inline-flex";
  window.style.zIndex = 100;
}

// function for mobile contact editing
async function mobileEditContact(){
  editContact(currentEditIndex);
}

// function for mobile contact deleting
async function mobileDelContact(){
  delContact(currentEditIndex);
}

// function for auto setting a new contact for demo purpose

// function setContactValue(){
//   document.getElementById('addContactName').value  = newContacts[0]['name'];
//   document.getElementById('addContactEmail').value = newContacts[0]['email'];
//   document.getElementById('addContactPhone').value = newContacts[0]['phone'];
// }

// takes the input from add contact window and adds the contact to storage if its not a duplicate name
async function addContact(){
  let addContactNameInput = document.getElementById('addContactName');
  let addContactEmailInput = document.getElementById('addContactEmail');
  let addContactPhoneInput = document.getElementById('addContactPhone');
    const newContact = {
      name: addContactNameInput.value,
      email: addContactEmailInput.value,
      phone: addContactPhoneInput.value,
      id: new Date().getTime()
    };
    const isNameDuplicate = loadedContacts.some(contact => contact.name.toLowerCase() === addContactNameInput.value.toLowerCase());
    if (isNameDuplicate) {
      closeAddNewContact();
      alert('contact exists already');
    } else {
      loadedContacts.push(newContact);
      loadedContacts.sort((a, b) => a.name.localeCompare(b.name));
      await setItem("kontakte", JSON.stringify(loadedContacts));
      contactsListRender(loadedContacts);
      closeAddNewContact();
      setTimeout(addContactSuccess, 800);
    }
}

// 
async function addMobileContact() {  
  addNewContactWindow();
}

// popup to show contact add success
function addContactSuccess(){
  let success = document.getElementById('newContactSuccess');
  success.style.display = 'inline-flex';
    setTimeout(function() {
      success.style.top = '50%';
  }, 50)
  setTimeout(addContactSuccessClose, 1600);
}

// closes the success popup again
function addContactSuccessClose(){
  let success = document.getElementById('newContactSuccess');
  success.style.display = 'none';
  setTimeout(function() {
    success.style.top = '120%';
}, 50)
}

let currentEditIndex; 


// edit clicked contact 
async function editContact(i) {
  let editContactWindow = document.getElementById("editContact");
  editContactWindow.classList.add('editContactOn')
  const contactsString = await getItem("kontakte");
  loadedContacts = JSON.parse(contactsString);
  const contact = loadedContacts[i];
  let uppercaseLetters = (str) => {return str.split("").filter((char) => /[A-Z]/.test(char));};
  const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
  document.getElementById("popup-bg").style.display = "block";
  document.getElementById("editContactName").value = contact["name"];
  document.getElementById("editContactEmail").value = contact["email"];
  document.getElementById("editContactPhone").value = "+" + contact["phone"];
  document.getElementById("contactEditImage").innerHTML = uppercaseLetter;
  currentEditIndex = i;
}

// save edited contact to storage
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

// delete edited contact from storage
async function delEditedContact(){
  const deletedIndex = currentEditIndex;
  const contactsString = await getItem("kontakte");
  loadedContacts = JSON.parse(contactsString);
  loadedContacts.splice(deletedIndex, 1)[0];
  await setItem("kontakte", JSON.stringify(loadedContacts));
  contactsListRender(loadedContacts);
  openContactView(currentEditIndex)
  closeEditContact();
  closeMobileOptionsWindow();
}

// delete contact from storage
async function delContact(i) {
    const contactsString = await getItem("kontakte");
    loadedContacts = JSON.parse(contactsString);
    loadedContacts.splice(i, 1)[0];
    await setItem("kontakte", JSON.stringify(loadedContacts));
    contactsListRender(loadedContacts);
    openContactView(i);
}

// close add new contact popup
function closeAddNewContact() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.classList.remove('addContactOn');
  document.getElementById("popup-bg").style.display = "none";
  document.getElementById('addContactName').value = '';
  document.getElementById('addContactEmail').value ='';
  document.getElementById('addContactPhone').value ='';
}

// close edit contact popup
function closeEditContact() {
  let editContactWindow = document.getElementById("editContact");
  editContactWindow.classList.remove('editContactOn')
  document.getElementById("popup-bg").style.display = "none";
  document.getElementById("editContactName").value = '';
  document.getElementById("editContactEmail").value = '';
  document.getElementById("editContactPhone").value = '';
}


function closeWindow(element){
  element.style.display = "none";
}

// close mobile options for Edit and Delete
function closeMobileOptionsWindow(){
  let window = document.getElementById('mobileOptionsWindow');
  window.style.display = "none";
  document.getElementById("popup-bg").style.display = "none";
}

// adds a listener to popup background to close itself and other functions
document.addEventListener("DOMContentLoaded", function () {
  let popupBg =  document.getElementById("popup-bg")
    if (popupBg) {
      popupBg.addEventListener("click", function (event) {
        event.stopPropagation();
        popupBg.style.display = "none";
        closeAddNewContact();
        closeEditContact();
        closeMobileOptionsWindow();
      });
    }

});

// document.addEventListener("DOMContentLoaded", function (event) {
//     closeMobileOptionsWindow();
//     event.stopPropagation();
// });

