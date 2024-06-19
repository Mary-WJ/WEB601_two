//database connection

require('dotenv').config({ path: './../.env' }); //to connect to the .env file where the credentials are stored

//initialize mangoose package
const mongoose = require('mongoose');


//connect to database using mongoose
//connectDB() function is defined below so can connect exports later for use
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


//export the db connection
module.exports = { connectDB };	
