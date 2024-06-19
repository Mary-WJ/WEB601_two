//the .env file reference
require('dotenv').config({ path: '../.env' });

//import the database connection function mongodb
const { connectDB } = require('./db/database.js'); 
//the model schema is imported
const Note = require('./model/model.js'); 

//initialize packages
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');


//load express
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(express.static('../app/public'));

//port 
const PORT = process.env.PORT || 3000;



//Routes define from below here

//get all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find({});
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error });
    }
});



//send note via post request
app.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = new Note({ title, content });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});




// get a single note from the database
app.get('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});



//update the note 
//here put is used instead of patch as put is used for full update
app.put('/api/notes/:id', async (req, res) => {
    
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
})





//delete note
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});






// Connect to MongoDB and the port
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(error => {
    console.error('Failed to connect to database', error);
});
    


