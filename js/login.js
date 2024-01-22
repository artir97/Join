let users = [];
let loggedInUser = null;

// listens to a loginbutton to click perform login function
document.addEventListener('DOMContentLoaded', function () {
    if (document.location.pathname.includes("index.html")){
        document.getElementById('loginBtn').addEventListener('click', login);
    }
});

//intitalize onload
async function initUsers() {
    await loadUsers();
}

//Get users 
async function loadUsers() {
        users = JSON.parse(await getItem('users'));
}

// logs in user with given inputs
function login(event) {
    event.preventDefault();

    let emailInput = document.getElementById('login');
    let passwordInput = document.getElementById('password');
    let enteredEmail = emailInput.value;
    let enteredPassword = passwordInput.value;
    let userIndex = users.findIndex(user => user.email === enteredEmail);

    if (userIndex !== -1) {
        if (users[userIndex].password === enteredPassword) {
            loggedInUser = users[userIndex];
            document.cookie = 'loggedInUser=' + encodeURIComponent(JSON.stringify(loggedInUser));
            window.location.href = 'summary.html';
        } else {
            alert('Incorrect password. Please try again.');
        }
    } else {
        alert('User not found. Please register or check your email.');
    }

}

// gets guest access to login
function guestLogin() {
    location.href = "summary.html";
}