const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: true,
        },
        username: {
            type: String, 
            required: true,
        },
        password: {
            type: String,   
            required: true,
        }, 
        
    }
);

userSchema.methods = {
    authenticate: function (password) {
        //TODO: authenticate password
        return this.password === password;
    }
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;