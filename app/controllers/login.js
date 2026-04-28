/*app/controllers/login.js*/

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter the credentials.');
        return;
    }

    //1st sends credential to the server, session not yet created (2nd onto server.js)
    //2.1 User Authentication, gets/send the username and password to the server for verification (server.js)
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(result => {
        //4th after a session is created from the server, allows you to redirect to homepage (5th onto homepage.js)
        //2.3 User Authentication, if login successful redirects to homepage with a session
        if (result.success) {
            window.location.href = '/app/pages/homepage.html';
        } else {
            alert(result.message);
        }
    })
    .catch(error => {
        alert('Could not connect to server.');
        console.error('Error:', error);
    });
}