/* app/controllers/register.js */

function handleRegister() {
    const username        = document.getElementById('username').value.trim();
    const password        = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (!username || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }

    const hasLowerCase   = /[a-z]/.test(password);
    const hasUpperCase   = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);

    if (!hasLowerCase)   { alert('Password must contain at least one lowercase letter.'); return; }
    if (!hasUpperCase)   { alert('Password must contain at least one uppercase letter.'); return; }
    if (!hasSpecialChar) { alert('Password must contain at least one special character.'); return; }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    //3.2 Menu Enhancement (Create new user account) register form validation and submission to backend MongoDB (server.js)
    // send the credentials/new user data to server
    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(result => {
        //3.3 Menu Enhancement (Create new user account) then redirects to edit profile after successful registration
        if (result.success) {
            alert(result.message);
            window.location.href = '/app/pages/profile.html'; //6.1 goes to profile page (profile.html)
        } else {
            alert(result.message);
        }
    })
    .catch(err => {
        alert('Could not connect to server.');
        console.error(err);
    });
}