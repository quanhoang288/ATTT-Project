const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
module.exports.signup = async (req, res) => { 
    const {name, username, password} = req.body;
    const user = await User.findOne({username: username});
    if (user) {
        return res.status(400).json({message: 'User already registered'});
    }
    //TODO: hash password
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);
    try {
        const newUser = new User({
            name: name, 
            username: username,
            password: hashedPassword
        });
        newUser.save();
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({message: 'Error registering user'});
    }

};

module.exports.signin = async (req, res) => {
    const {username, password} = req.body; 
    const user = await User.findOne({username: username});

    if (user) {
        const result = await user.authenticate(password);
        if (result) {
            // const token = jwt.sign(
            //     { user: user }, 
            //     process.env.JWT_SECRET,
            
            // );
            // return res.status(200).json({
            //     user: user, 
            //     token: token
            // })
            return res.status(200).json(user);
        }
        else {
            return res.status(400).json("Incorrect password");
        }
    }
    else {
        return res.status(404).json("No user found");
    }
    

};