require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Note = require('./model.js');

function connectDB() {
    const dbUser = process.env.DB_USERNAME;
    const dbPass = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;

    return mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@notedb.gckbyvw.mongodb.net/${dbName}`)
    .then(() => {
        console.log('connected to Database');
    })
    .catch((error) => {
        console.log('could not connect to db', error);
    })
    
}


module.exports = { connectDB };	
