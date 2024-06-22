//protect Routes
//implement middleware to protect routes that require authentication

const jwt = require('jsonwebtoken');
const User = require('../model/user');

const protect = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from header bearer
            token = req.headers.authorization.split(' ')[1]; //this get the token

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user from the token
            req.user = await User.findById(decoded.id).select('-password'); //without the password
            next();
        }catch(error){
            console.log(error);

            res.status(401); //unauthorized
            throw new Error('Not authorized');
        }
    }

    if(!token){
        res.status(401); //unauthorized
        throw new Error('Not authorized, no token');
    }
}


module.exports = {protect}