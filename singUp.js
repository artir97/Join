function openPage(page) {
    window.location.href = `${page}`;
}

let users = [];

async function init(){
    loadUsers();
}

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e) {
        console.error('Loading error:', e);
    }
    
}

//Set users
async function register(){
    signUpBtn.disabled = true;
    console.log('in function regsiter()');

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

function resetForm(){
    user_name.value = '';
    email.value = '';
    password.value = '';
    repeat_password.value = '';
    signUpBtn.disabled = false;
}