const notesContainer = document.getElementById('notes');
const searchBar = document.getElementById('searchInput');


//logout btn
const logoutBtn = document.getElementById('logoutBtn');

let notesData = []; // emapty Array to store all notes from database

document.addEventListener('DOMContentLoaded', function () {
    fetchNotes();


    // Searchbar  functionality
    searchBar.addEventListener('input', () => {
        const filteredNotes = notesData.filter(note => note.title.toLowerCase().includes(searchBar.value.toLowerCase()));
        displayNotes(filteredNotes); //this will display the filtered note depending on the title of the note
    });
    
    // Function to display notes
    function displayNotes(notes) {
        notesContainer.innerHTML = ''; // Clear existing notes display
        notes.forEach(note => {

            //for every note that is create by the user, create a div
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');


            //this is the whole one to store the note
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('note-content');

            //the title of the note using h1
            const noteTitle = document.createElement('h2');
            noteTitle.classList.add('note-title');
            noteTitle.textContent = note.title;
            contentDiv.appendChild(noteTitle);

            //the paragraph of the note content
            const noteDescription = document.createElement('p');
            noteDescription.classList.add('note-description');
            noteDescription.textContent = note.content;
            contentDiv.appendChild(noteDescription);

            noteDiv.appendChild(contentDiv);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('note-buttons');


            //edit button 
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('edit-btn');
            buttonsDiv.appendChild(editButton);


            //delete button
            const deleteButton = document.createElement('i');
            deleteButton.classList.add('fa-solid', 'fa-trash', 'delete-btn');
            buttonsDiv.appendChild(deleteButton);

            noteDiv.appendChild(buttonsDiv);
            notesContainer.appendChild(noteDiv);

      
            //delete button event listiener
            deleteButton.addEventListener('click', () => {
                // console.log("Delete button clicked for note ID:", note._id);
                deleteNote(note._id, noteDiv);

            });

            //edit button listener
            editButton.addEventListener('click', () => {
                editNote(note._id);
            });
            


        });

    };

    // Fetch notes from the server database
    function fetchNotes() {
        const token = localStorage.getItem('token'); // Retrieve the stored token
        if (!token) {
            console.error('No token found, redirecting to login...');
            window.location.href = 'login.html'; // Redirect to login if no token is found
            return;
        }

        fetch("http://localhost:3000/api/notes", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }

            return response.json();
        })
        .then(notes => {
            notesData = notes;
            displayNotes(notesData);
        })
        .catch(error => {
            console.error('Error fetching notes:', error);
            notesContainer.innerHTML = '<p>Error loading notes.</p>';
        });
    }

});



// Delete the note
function deleteNote(noteId, noteDiv) {
    fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Remove the note from the DOM
            noteDiv.remove();
            // Remove the note from notesData
            notesData = notesData.filter(note => note._id !== noteId);
            // show a toast notification to the user
            Toastify({
                text: "Note is deleted successfully!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                },
                className: "info",
            }).showToast();
        } else {
            console.error('Failed to delete note');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



function editNote(noteId) {
    fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Failed to fetch note');
        }
    })
    .then(note => {
        // Redirect to create note page with note ID
        window.location.href = `index.html?id=${noteId}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });

}


// Function to handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '../auth/login.html';
})