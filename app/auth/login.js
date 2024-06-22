//login form
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try{
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            }),
        });

        const data = await response.json();

        // Check if the request was successful
        if(response.ok) {
            //ok then redirect
            localStorage.setItem('token', data.token); // Store the token in local storage
            window.location.href = '../public/notes.html';
 
        } else {
            // Show an error message
            alert(data.message || 'Login failed');
        }

    }catch(error){
        console.error('An error occurred:', error);
        alert('An error occurred. Please try again.');
    }
})



