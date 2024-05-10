// login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if username is empty
    if (usernameInput.value.trim() === '') {
        alert('Please enter a username');
        event.preventDefault();
        return;
    }

    // Check if password is empty
    if (passwordInput.value.trim() === '') {
        alert('Please enter a password');
        event.preventDefault();
        return;
    }


});
