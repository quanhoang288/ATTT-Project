const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        
    },
    {timestamps: true}
);

const Message = mongoose.model('Message', messageSchema, 'messages');

module.exports = Message;