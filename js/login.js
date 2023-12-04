console.log('login.js');

let users = []; // Correct variable name

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginBtn').addEventListener('click', login);
});

async function initUsers() {
    console.log('in initUsers()');
    await loadUsers(); // Make sure to await the asynchronous function

    console.log(users[0]);
    console.log(users[1]);
    console.log(users[0].email);
    console.log(users[0].password);

    console.log('_________________________________');

    for(let i=0; i<users.length; i++){
        console.log(users[i]);
    }
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function login() {
    console.log('ich bin in der login() funktion');

    let emailInput = document.getElementById('login');
    let passwordInput = document.getElementById('password');

    // Get entered email and password
    let enteredEmail = emailInput.value;
    let enteredPassword = passwordInput.value;

    // Check if the entered email exists in the users array
    let userIndex = users.findIndex(user => user.email === enteredEmail);

    if (userIndex !== -1) {
        // User found, check the password
        if (users[userIndex].password === enteredPassword) {
            // Password is correct, navigate to summary.html
            window.location.href = 'summary.html';
        } else {
            // Password is incorrect
            alert('Incorrect password. Please try again.');
        }
    } else {
        // User not found
        alert('User not found. Please register or check your email.');
    }
}

function guestLogin() {
    location.href = "summary.html";
}
