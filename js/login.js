let users = [];
let accumulator = [];
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
    removeDuplicateUsers(users);
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

    showError('emailError', '');
    showError('passwordError', '');

    if (userIndex !== -1) {
        if (users[userIndex].password === enteredPassword) {
            loggedInUser = users[userIndex];
            document.cookie = 'loggedInUser=' + encodeURIComponent(JSON.stringify(loggedInUser));
            window.location.href = 'summary.html';
        } 
        else {
            passwordError.textContent = 'Incorrect password. Please try again.';
            // alert('Incorrect password. Please try again.');
        }
    }
     else {
        emailError.textContent = 'User not found. Please register or check your email.';
    }

}


async function removeDuplicateUsers(users) {
    let uniqueUsers = users.reduce((accumulator, currentUser) => {
        if (!accumulator.find(user => user.email === currentUser.email)) {
            accumulator.push(currentUser);
        }
        return accumulator;
    }, []);
    await setItem('users', JSON.stringify(uniqueUsers));
    return uniqueUsers;
}

function showError(elementId, message) {
    let errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}
// gets guest access to login
function guestLogin() {
    location.href = "summary.html";
}