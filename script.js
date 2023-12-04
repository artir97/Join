async function init() {
    await includeHTML();
    //Timeout war 800 -> stelle kürzer um am login zu arbeiten
    setTimeout(loadimg, 0);
    contactsListRender();
}


function loadimg() {
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

