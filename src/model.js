//model schema 
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,                         
        maxlength: [100, 'Title cannot be more than 100 characters'] 
    },
    content: {
        type: String,
        required: [false, 'Content is required'],
        trim: true,
        maxlength: [1000, 'Content cannot be more than 1000 characters'] 
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields


module.exports = mongoose.model('Note', noteSchema);