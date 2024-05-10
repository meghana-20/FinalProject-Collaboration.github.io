// register.js
document.getElementById('registerForm').addEventListener('submit', function(event) {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if first name is empty
    if (firstNameInput.value.trim() === '') {
        alert('Please enter your first name');
        event.preventDefault();
        return;
    }

    // Check if last name is empty
    if (lastNameInput.value.trim() === '') {
        alert('Please enter your last name');
        event.preventDefault();
        return;
    }

    // Check if email is empty
    if (emailInput.value.trim() === '') {
        alert('Please enter your email');
        event.preventDefault();
        return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        alert('Please enter a valid email address');
        event.preventDefault();
        return;
    }

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

    // Check if password is at least 6 characters long
    if (passwordInput.value.length < 6) {
        alert('Password must be at least 6 characters long');
        event.preventDefault();
        return;
    }
});
