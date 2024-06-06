//route define here

const express = require('express');
const router = require('./routes');
const cors = require('cors');
const app = express();
app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.send('hello');
})


