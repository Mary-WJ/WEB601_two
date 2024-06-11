const notesContainer = document.getElementById('notes');
const searchBar = document.getElementById('searchInput');

let notesData = []; // emapty Array to store all notes from database

document.addEventListener('DOMContentLoaded', function () {
    
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
                window.location.href = `index.html?id=${note._id}`; // Redirect to create note page with note ID
            });
            


        });

    };

    // Fetch notes from the server database
    fetch("http://localhost:3000/api/notes")
    .then(response => response.json())
    .then(notes => {
        notesData = notes; // Stored all the notes from the database to the empty array that was defined at the top
        displayNotes(notesData); // Display all notes using the displayNotes() function at the above
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
        notesContainer.innerHTML = '<p>Error loading notes.</p>';
    });

    // Searchbar  functionality
    searchBar.addEventListener('input', () => {
        const filteredNotes = notesData.filter(note => note.title.toLowerCase().includes(searchBar.value.toLowerCase()));
        displayNotes(filteredNotes); //this will display the filtered note depending on the title of the note
    });

});



// Delete the note
function deleteNote(noteId, noteDiv) {
    fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: 'DELETE'
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




