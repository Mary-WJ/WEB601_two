require('dotenv').config({ path: '../.env' });

//initial express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
