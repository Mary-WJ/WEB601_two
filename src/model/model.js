//define the database schema 
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user:{  //a note is associated with a user
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {   //title is a required field
        type: String,
        required: [true, 'Title is required'],
        trim: true,                         
        maxlength: [100, 'Title cannot be more than 100 characters'] 
    },
    content: {  //content is not required field
        type: String,
        required: [false, 'Content is required'],
        trim: true,
        maxlength: [1000, 'Content cannot be more than 1000 characters'] 
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields


module.exports = mongoose.model('Note', noteSchema); //export the model schema named 'Note' using the noteSchema
