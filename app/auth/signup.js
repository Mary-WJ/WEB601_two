//signup form
const signupForm = document.querySelector('#signupForm');

signupForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    // Password validation to ensure it is at least 6 characters long
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return; // Stop the form submission
    }

    try{
        //post response to the server
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password
            }),
        });

        const data = await response.json();
        // Check if the request was successful
        if(response.ok) {

            if (data.token) {
                localStorage.setItem('token', data.token); // Store the token in localStorage
            }
            window.location.href = '../public/notes.html';
            // Optionally, redirect or perform further actions here
        } else {
            // Show an error message
            alert(data.message);
        }

  
    }catch(error){
        console.error('An error occurred:', error);
        alert('An error occurred. Please try again.');
    }
})

