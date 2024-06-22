//the .env file reference
require('dotenv').config({ path: '../.env' });

//import the database connection function mongodb
const { connectDB } = require('./db/database.js'); 
//the model schema is imported
const Note = require('./model/model.js'); 
const User = require('./model/user.js');

//protect routes
const { protect } = require('./middleware/authMiddleware.js');

//initialize packages
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');


//load express
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('./app/public'));




//auth Route
app.use(authRouter);

//port 
const PORT = process.env.PORT || 3000;






//Routes define from below here

//get all notes
app.get('/api/notes',protect, async (req, res) => {
    try {
        const notes = await Note.find({user: req.user._id}); // Find all notes that belong to the authenticated user
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error });
    }
});



//send note via post request
app.post('/api/notes', protect, async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = new Note({
            title,
            content,
            user: req.user._id //create note for the authenticated user
        });

        await note.save();

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});




// get a single note from the database
app.get('/api/notes/:id', protect, async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Check if the logged-in user is the owner of the note
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to access this note' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});



//update the note 
//here put is used instead of patch as put is used for full update
app.put('/api/notes/:id', protect,  async (req, res) => {
    
    const { id } = req.params;
    const { title, content } = req.body;

    try {

        // Find the note by ID to check ownership
        const note = await Note.findById(id);
        if (!note) { //check if note exists
            return res.status(404).json({ error: 'Note not found' });
        }

        const user = await User.findById(req.user._id);
        if (!user) { //check if user exists
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the logged-in user is the owner of the note
        if (note.user.toString() !== user.id) {
            return res.status(401).json({ error: 'Not authorized to access' });
        }

        const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
        if(!updatedNote){
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(200).json(updatedNote);

    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
})





//delete note
app.delete('/api/notes/:id', protect , async (req, res) => {
    const { id } = req.params;
    try{
        if(!id){
            return res.status(404).json({ error: 'Note not found' });
        }

        const user = await User.findById(req.user._id);
        if (!user) { //check if user exists
            return res.status(404).json({ error: 'User not found' });
        }
      
        const note = await Note.findById(id);
        //make sure the logged in user matches the goals user
        if (note.user.toString() !== user.id) {
            return res.status(401).json({ error: 'user Not authorized' });
        }

        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    }catch(error){
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
    


