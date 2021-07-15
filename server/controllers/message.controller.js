const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const mongo = require('mongodb');
module.exports.create = async function(req, res) {
    try {

        const conversationId = new mongo.ObjectID(req.body.conversationId);
        let conversation = await Conversation.findOne({_id: conversationId});
        if (!conversation.members.includes(req.body.sender)) {
            return res.status(400).json('Sender id is not in the conversation');
        }

        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        console.log(savedMessage.createdAt);

        const updatedConversation = await Conversation.findOneAndUpdate(
            {_id: conversationId},
            {updatedAt: savedMessage.createdAt},
            {new: true}
        );
        console.log(updatedConversation)

        return res.status(201).json(savedMessage);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

module.exports.getMessagesByConversationId = async function(req, res) {
    const userId = req.query.userId;
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        const filteredMessages = messages.filter(m => {
            const senderId = m.sender;
            const type = m.type;
            if (senderId === userId && type === 'RSA')
                return false;
            if (senderId !== userId && type === 'AES')
                return false;
            return true;
        });
        return res.status(200).json(filteredMessages);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
}

module.exports.getLatestMessageByConversationId = async function (req, res) {
    const userId = req.query.userId;
    try {

        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({createdAt: -1}).limit(2);
        console.log(messages);
        if (messages.length > 0) {
            const [aesMessage, rsaMessage] = messages;
            
            return rsaMessage.sender === userId ? res.status(200).json(aesMessage) : res.status(200).json(rsaMessage);
        }
        return res.status(404).json("No message found");
        
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}



