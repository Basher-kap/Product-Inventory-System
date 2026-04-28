/* app/controllers/profile.js */

//1.3 actions for User Profile Management
// check session and load profile on page load
fetch('/api/session')
    .then(res => res.json())
    .then(result => {
        if (!result.success) {
            window.location.href = '/login.html';
        } else {
            document.getElementById('profile-username').textContent = result.username;
            document.getElementById('profile-icon').textContent = result.username.charAt(0).toUpperCase();
            loadProfile();
        }
    });

function loadProfile() {
    fetch('/api/profile')
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                const u = result.user;
                document.getElementById('firstName').value  = u.firstName  || '';
                document.getElementById('middleName').value = u.middleName || '';
                document.getElementById('lastName').value   = u.lastName   || '';
                document.getElementById('address').value    = u.address    || '';
                document.getElementById('email').value      = u.email      || '';
            }
        });
}

function saveProfile() {
    const firstName  = document.getElementById('firstName').value.trim();
    const middleName = document.getElementById('middleName').value.trim();
    const lastName   = document.getElementById('lastName').value.trim();
    const address    = document.getElementById('address').value.trim();
    const email      = document.getElementById('email').value.trim();

    // basic validation
    if (!firstName || !lastName || !email) {
        alert('First Name, Last Name, and Email are required.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, middleName, lastName, address, email })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert(result.message);
            //6.3 Login Functionality, after saving profile, goes to homepage
            window.location.href = '/app/pages/homepage.html'; // redirect to homepage after saving profile
        } else {
            alert(result.message);
        }
    })
    .catch(err => {
        alert('Could not connect to server.');
        console.error(err);
    });
}