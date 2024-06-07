require('dotenv').config({ path: '../../.env' });   //connect to mangodb and port

const mongoose = require('mongoose');
const express = require('express');

const cors = require('cors');
const app = express();


//middleware
app.use(express.json());
app.use(cors());


//connection to db
const PORT = process.env.PORT || 3000;
const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;

//here goes the schema


mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@notedb.gckbyvw.mongodb.net/`)
.then(() => {
    console.log('connected to db');
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    })
})
.catch((error) => {
    console.log('could not connect to db', error);
})