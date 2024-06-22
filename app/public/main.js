// Get the note ID from the URL if present
const queryParams = new URLSearchParams(window.location.search); // Extract the query string from the URL
const noteId = queryParams.get("id"); // Extract the 'id' parameter from the query string

// Logout button
const logoutBtn = document.getElementById('logoutBtn');

// Function to handle logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '../auth/login.html';
})

// Frontend code
const noteForm = document.querySelector("form");
const noteTitle = document.querySelector(".titleHeader");
const noteContent = document.querySelector(".content");
const cancelBtn = document.querySelector(".cancelBtn");

// Function to load existing note content if noteId is present
function loadNoteContent(noteId) {
  const token = localStorage.getItem('token');
  fetch(`http://localhost:3000/api/notes/${noteId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : undefined
    }
  })
  .then(response => response.json())
  .then(note => {
    noteTitle.value = note.title; // note title
    noteContent.value = note.content; // note content title
  })
  .catch(error => console.error("Failed to fetch note:", error));
}

// Load note content if editing an existing note
if (noteId) {
  loadNoteContent(noteId);
}

cancelBtn.addEventListener('click', () => {
  window.location.href = 'notes.html';
});

// Function to handle form submission
noteForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the form from submitting

  const titleValue = noteTitle.value;
  const contentValue = noteContent.value;

  if (!titleValue.trim()) {
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

  const token = localStorage.getItem('token');
  const headers = {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : undefined
  };

  const url = noteId ? `http://localhost:3000/api/notes/${noteId}` : "http://localhost:3000/api/notes";
  const method = noteId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify({
      title: titleValue,
      content: contentValue,
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to save the note");
    }
    return response.json();
  })
  .then(data => {
    const successMessage = noteId ? "Note updated successfully!" : "Note created successfully!";
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
      noteTitle.value = "";
      noteContent.value = "";
    }
  })
  .catch(error => {
    console.error("Error:", error);
    Toastify({
      text: "Error saving note: " + error.message,
      duration: 5000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
      className: "error",
    }).showToast();
  });
});
