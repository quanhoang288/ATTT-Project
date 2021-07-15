const mongoose = require('mongoose');


const conversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array
        }
    }, {timestamps: true}
);

const Conversation = mongoose.model('Conversation', conversationSchema, 'conversations');

module.exports = Conversation;