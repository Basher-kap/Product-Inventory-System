// Check session on page load 
//7. Change Password Feature,  * The user must be logged in before changing the password, using session here
fetch('/api/session')
    .then(res => res.json())
    .then(result => {
        if (!result.success) {
            // not logged in kick back to login
            window.location.href = '../login.html';
        } else {
            document.getElementById('profile-username').textContent = result.username;
            document.getElementById('profile-icon').textContent = result.username.charAt(0).toUpperCase();
        }
    });

function goToHomepage(event) {
    event.preventDefault();
    window.location.href = 'homepage.html';
}

function handleChangePassword() {
    const oldPassword = document.getElementById('old-password').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    //7. Change Password Feature,    * Require input of the current password for verification
    //7. Change Password Feature,       * Allow the user to enter and confirm a new password
    if (oldPassword === newPassword) {
        alert('New password cannot be the same as the old password.');
        return;
    }

    if (newPassword.length < 8) {
        alert('New password must be at least 8 characters long.');
        return;
    }

    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(newPassword);

    if (!hasLowerCase) { alert('New password must contain at least one lowercase letter.'); return; }
    if (!hasUpperCase) { alert('New password must contain at least one uppercase letter.'); return; }
    if (!hasSpecialChar) { alert('New password must contain at least one special character.'); return; }
    if (newPassword !== confirmPassword) { alert('Passwords do not match.'); return; }

    // send the old and new password to the server for validation and update
    // 7. Change Password Feature,    * Update and save the new password to the file
    fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert(result.message);
            // Logout session then redirect
            fetch('/api/logout', { method: 'POST' })
                .then(() => window.location.href = '../login.html');
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        alert('Could not connect to server.');
        console.error('Error:', error);
    });
}