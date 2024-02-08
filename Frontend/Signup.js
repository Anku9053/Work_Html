document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.text())
        .then(message => {
            console.log(message);
            alert('Registration successful. You can now log in.');
            window.location.href = 'login.html'; 
        })
        .catch(error => console.error('Error registering user:', error));
    });
});
