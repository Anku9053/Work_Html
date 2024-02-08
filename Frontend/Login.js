document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Invalid credentials');
            }
        })
        .then(message => {
            console.log(message);
            alert('Login successful.');
            window.location.href = 'Homepage.html';
        })
        .catch(error => {
            console.error('Error logging in:', error);
            alert('Invalid credentials. Please try again.');
        });
    });
});
