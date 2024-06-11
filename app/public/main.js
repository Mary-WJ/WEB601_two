// Backend code

// Get the note ID from the URL if present
const queryParams = new URLSearchParams(window.location.search); // Extract the query string from the URL
const noteId = queryParams.get("id"); // Extract the 'id' parameter from the query string

// Frontend code
const noteForm = document.querySelector("form");
const noteTitle = document.querySelector(".titleHeader");
const noteContent = document.querySelector(".content");
const cancelBtn = document.querySelector(".cancelBtn");

// Function to load existing note content if noteId is present
function loadNoteContent(noteId) {
  // Fetch the note from the server database with a specfic id
  fetch(`http://localhost:3000/api/notes/${noteId}`)
    .then((response) => response.json())
    .then((note) => {
      //comes from the response and for each note
      noteTitle.value = note.title; // note title
      noteContent.value = note.content; // note content title
    })
    .catch((error) => console.error("Failed to fetch note:", error)); // if there is an error then, catch it
};



// Load note content if editing an existing note
if (noteId) { //check if exist and if it does then load the content based on the id
  loadNoteContent(noteId);
}


cancelBtn.addEventListener('click', () => {
    window.location.href = 'notes.html';
});

// Function to handle form submission
noteForm.addEventListener("submit", (e) => {
  e.preventDefault(); //prevent the form from submitting

  const titleValue = noteTitle.value; //get the value of the title
  const contentValue = noteContent.value; //get the value of the content
 

  if (!titleValue.trim()) { //if the title is empty then notify user using toastityyyyyy
    Toastify({
      text: "The Title can't be empty",
      duration: 5000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
      className: "error",
    }).showToast();
    return;
  }

  // Determine whether to use POST or PUT method based on noteId
  const url = noteId  // either post or put since use case is similar her
    ? `http://localhost:3000/api/notes/${noteId}` //for the put request
    : "http://localhost:3000/api/notes"; //this one is for post
  const method = noteId ? "PUT" : "POST";

  // Fetch request for either creating or updating a note
  fetch(url, {
    method: method, // either post or put depending on the noteId include or not
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: titleValue,
      content: contentValue,
    }),
  })
    .then((response) => {

      if (!response.ok) { //if response is not ok then
        throw new Error("Failed to save the note"); //throw error
      }
      return response.json(); //return the response if it's ok

    })
    .then((data) => { ///the reponse data is here
      // Display success toast notification
      const successMessage = noteId
        ? "Note updated successfully!" //if put then display this message
        : "Note created successfully!"; //if post then display this one
      Toastify({
        text: successMessage,
        duration: 5000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        className: "info",
      }).showToast();
      if (!noteId) { 
        // Reset form if it was a new note
        noteTitle.value = "";
        noteContent.value = "";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
