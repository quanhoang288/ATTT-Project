const User = require('../models/user.model');
const mongo = require('mongodb');


module.exports.findAll = async function(req, res) {

    try {
        const users = await User.find().sort({name: -1});
        if (users) {
            return res.status(200).json(users);
        }
        return res.status(404).json('No user found');
        
    } catch (err) {
        return res.json(500).json(err);
    }
}


module.exports.findOne = async function (req, res) {
    try {
        const id = new mongo.ObjectID(req.params.id);
        const user = await User.findOne({_id: id});
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json("User not found");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}
