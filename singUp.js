function openPage(page) {
    window.location.href = `${page}`;
}

let users = [];

async function init(){
    loadUsers();
}

async function loadUsers(){
        users = JSON.parse(await getItem('users'));    
}

//Set users
async function register(){
    const signUpBtn = document.getElementById('signUpBtn');
    const user_name = document.getElementById('user_name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const repeat_password = document.getElementById('repeat_password');
    signUpBtn.disabled = true;

    if (password.value !== repeat_password.value) {
        alert('password is not the same');
        return;
    } else {
        users.push({
            user_name: user_name.value,
            email: email.value,
            password: password.value
        });
        await setItem('users', JSON.stringify(users));
    document.getElementById('msgBox').classList.remove('d-none');
    resetForm();


    setTimeout(() => {
        window.location.href = 'index.html?msg=Du hast dich erfolgreich registriert';
    }, 3000);
    }
}

function resetForm(){
    user_name.value = '';
    email.value = '';
    password.value = '';
    repeat_password.value = '';
    signUpBtn.disabled = false;
}