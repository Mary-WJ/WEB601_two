//define the routes for authentication (login and signup)
require('dotenv').config({ path: './../.env' });


const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//model 
const User = require('../model/user');

//router
const router = express.Router();


//register/signup route
//public

router.post('/api/auth/signup', async (req, res) => {
    //get the username, email, and password from the request body
    const {username, email, password} = req.body; 

    if(!username || !email || !password){ //if the username, email, and password are not provided
        res.status(400)
        throw new Error('Please add all fields');
    }
        
    //check if the user already exists
    const userExists = await User.findOne({email}); //check the user via email
    if(userExists){
        res.status(400)
        throw new Error('User already exists');
    }

    //hash the password
    const salt = await bcrypt.genSalt(10); //the default value is 10
    const hashedPassword = await bcrypt.hash(password, salt); //the password is the orginal password and the salt is the hashed password

    //create a new user
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    if(user){ //if the user is created
        res.status(201).json({
            _id:user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data');
    }
   
});



//login route
//public
router.post('/api/auth/login', async (req, res) => {
    const {email, password} = req.body;

    //check if the user exists
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){ //if the user exists and the password provided matches with the hashed password
        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid credentials');
    }
});



const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d'});
}

module.exports = router;