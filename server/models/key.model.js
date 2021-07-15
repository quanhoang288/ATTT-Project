const mongoose = require('mongoose');


const keySchema = new mongoose.Schema(
    {
        userId: {
            type: String, 
            required: true,
        },
        publicKey: {
            type: String, 
            required: true,
        },
        
    }
);



const Key = mongoose.model('Key', keySchema, 'keys');

module.exports = Key;