console.log('login.js');

let users = [];
let loggedInUser = null;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginBtn').addEventListener('click', login);
});

async function initUsers() {
    console.log('in initUsers()');
    await loadUsers(); // Make sure to await the asynchronous function
    console.log('_________________________________');
    for (let i = 0; i < users.length; i++) {
        console.log(users[i]);
    }
    console.log('_________________________________')
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function login(event) {
    event.preventDefault();
    console.log('ich bin in der login() funktion');

    let emailInput = document.getElementById('login');
    let passwordInput = document.getElementById('password');

    // Get entered email and password
    let enteredEmail = emailInput.value;
    let enteredPassword = passwordInput.value;

    // Check if the entered email exists in the users array
    let userIndex = users.findIndex(user => user.email === enteredEmail);

    if (userIndex !== -1) {
        if (users[userIndex].password === enteredPassword) {
            loggedInUser = users[userIndex];

            // Set a cookie with the user information
            document.cookie = 'loggedInUser=' + encodeURIComponent(JSON.stringify(loggedInUser));
            window.location.href = 'summary.html';
        } else {
            alert('Incorrect password. Please try again.');
        }
    } else {
        alert('User not found. Please register or check your email.');
    }
    console.log('loggedInUser in login() after click:', loggedInUser);

}

function guestLogin() {
    console.log('ich bin in der guest login funktion');
    location.href = "summary.html";
}