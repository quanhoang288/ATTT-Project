const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const mongo = require('mongodb');
module.exports.create = async function(req, res) {
    try {
        console.log(req.body.conversationId);
        const conversationId = new mongo.ObjectID(req.body.conversationId);
        const conversation = await Conversation.findOne({_id: conversationId});
        console.log(conversation.members);
        console.log(req.body.sender);
        if (!conversation.members.includes(req.body.sender)) {
            return res.status(400).json('Sender id is not in the conversation');
        }
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        return res.status(201).json(savedMessage);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports.getMessagesByConversationId = async function(req, res) {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports.getLatestMessageByConversationId = async function (req, res) {
    try {

        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({createdAt: -1}).limit(1);
        if (messages.length > 0) {
            return res.status(200).json(messages[0]);
        }
        return res.status(404).json("No message found");
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports.findOne = function(req, res) {

}

