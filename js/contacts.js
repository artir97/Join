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
  //
  //     'name': 'Tatjana Wolf',
  //     'email': 'wolf@gmail.com
];

async function contactsInit() {
  saveContacts(); //Kontakte speichern
  await loadContacts();
  
}

async function saveContacts() {
  try {
    const contactsString = JSON.stringify(allContacts);
    await setItem("kontakte", contactsString);
    // await setItem("kontakte", allContacts);
    console.log("Kontakte erfolgreich gespeichert.");
  } catch (error) {
    console.error("Fehler beim Speichern der Kontakte:", error);
  }
}

async function loadContacts() {
  try {
    // const loadedContacts = await getItem("kontakte");
    // contactsListRender(loadedContacts);
    // console.log("Geladene Kontakte:", loadedContacts);
    const contactsString = await getItem("kontakte");
    const loadedContacts = JSON.parse(contactsString);

    // Überprüfen, ob es sich um ein Array handelt, bevor es gerendert wird
    if (Array.isArray(loadedContacts)) {
      contactsListRender(loadedContacts);
      console.log("Geladene Kontakte:", loadedContacts);
    } else {
      console.error("Geladene Daten sind kein Array.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}


async function contactsListRender(contacts) {
  try {
    let contactsList = document.getElementById("contacts");
    contactsList.innerHTML ='';
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      contactsList.innerHTML += contactList(contact, i);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }

}

function contactList(contact, i) {
  let firstLetter = contact["name"].charAt(0).toUpperCase();
  let uppercaseLetters = (str) => {
    return str.split("").filter((char) => /[A-Z]/.test(char));
  };
  const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
  if (
    contactList.lastFirstLetter === undefined ||
    contactList.lastFirstLetter !== firstLetter
  ) {
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
    // Wenn Inhalt vorhanden, dann
    contactView.style = "left: 100%";
    removeColor(i);
    setTimeout(() => (contactView.innerHTML = ""), 200);
  } else {
    // const contact = contacts[i];
    const contactsString = await getItem("kontakte");
    const loadedContacts = JSON.parse(contactsString);
    const contact = loadedContacts[i];
    let name = contact["name"];
    let email = contact["email"];
    let phone = contact["phone"];
    contactView.style = "left: 332px";
    let uppercaseLetters = (str) => {
      return str.split("").filter((char) => /[A-Z]/.test(char));
    };
    const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
    contactView.innerHTML = "";
    contactView.innerHTML += renderContactView(
      i,
      name,
      email,
      phone,
      uppercaseLetter
    );
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
  for (let index = 0; index < contacts.length; index++) {
    const contactElement = document.getElementById(`contactInfo${index}`);
    const nameElement = document.getElementById(`contactName${index}`);
    const mailElement = document.getElementById(`contactMail${index}`);
    if (index === i) {
      contactElement.classList.add("blueColor");
      nameElement.classList.add("whiteColor");
      mailElement.classList.add("whiteColor");
    } else {
      contactElement.classList.remove("blueColor");
      nameElement.classList.remove("whiteColor");
      mailElement.classList.remove("whiteColor");
    }
  }
}

function removeColor(i) {
  document.getElementById(`contactInfo${i}`).classList.remove("blueColor");
  document.getElementById(`contactName${i}`).classList.remove("whiteColor");
  document.getElementById(`contactMail${i}`).classList.remove("whiteColor");
}

async function addNewContact() {
  const newContact = {
    name: "Neuer Kontakt", // Hier sollte der Name des neuen Kontakts stehen
    email: "neu@gmail.com", // Hier sollte die E-Mail des neuen Kontakts stehen
    phone: 49123456789, // Hier sollte die Telefonnummer des neuen Kontakts stehen
  };

  // Füge den neuen Kontakt hinzu
  allContacts.push(newContact);

  // Speichere die Kontakte
  await saveContacts();

let addNewContact = document.getElementById("addContact");
addNewContact.style = "right: 0";
document.getElementById("popup-bg").style.display = "block";
}

async function saveContacts() {
  try {
    const contactsString = JSON.stringify(allContacts);
    await setItem("kontakte", contactsString);
    console.log("Kontakte erfolgreich gespeichert.");
  } catch (error) {
    console.error("Fehler beim Speichern der Kontakte:", error);
  }
}

async function editContact(i) {
  const contactsString = await getItem("kontakte");
    const loadedContacts = JSON.parse(contactsString);
    const contact = loadedContacts[i];
  let uppercaseLetters = (str) => {
    return str.split("").filter((char) => /[A-Z]/.test(char));
  };
  const uppercaseLetter = uppercaseLetters(contact["name"]).join("");
  document.getElementById("popup-bg").style.display = "block";
  let editContact = document.getElementById("editContact");
  editContact.style = "left: 0";
  document.getElementById("editContactName").value = contact["name"];
  document.getElementById("editContactEmail").value = contact["email"];
  document.getElementById("editContactPhone").value =
    "+" + contact["phone"];
  document.getElementById("contactEditImage").innerHTML = uppercaseLetter;
  await setContactsInStorage();
}

async function delContact(i) {
  let contactView = document.getElementById("contactView");
  contactView.innerHTML = "";

  try {
    const currentContacts = await getItem("contacts");
    currentContacts.splice(i, 1);

    // Aktualisierte Kontakte speichern
    await setItem("contacts", currentContacts);

    // Hier kannst du die aktualisierten Kontakte für weitere Aktionen verwenden
    contactsInit();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

function closeAddNewContact() {
  let addNewContact = document.getElementById("addContact");
  addNewContact.style = "left: -100%";
  document.getElementById("popup-bg").style.display = "none";
}

function closeEditContact() {
  let editContact = document.getElementById("editContact");
  editContact.style = "left: -100%";
  document.getElementById("popup-bg").style.display = "none";
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

document.addEventListener("DOMContentLoaded", contactsInit);
