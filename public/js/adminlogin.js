// adminlogin.js
document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');

    // Check if admin username is empty
    if (adminUsernameInput.value.trim() === '') {
        alert('Please enter admin username');
        event.preventDefault();
        return;
    }

    // Check if admin password is empty
    if (adminPasswordInput.value.trim() === '') {
        alert('Please enter admin password');
        event.preventDefault();
        return;
    }
});
