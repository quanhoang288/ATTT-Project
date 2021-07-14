const mongoose = require('mongoose');
const argon2 = require('argon2');

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
    authenticate: async function (password) {
        //TODO: authenticate password
        return await argon2.verify(this.password, password);

    }
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;