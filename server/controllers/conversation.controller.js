const Conversation = require('../models/conversation.model');


module.exports.findAll = async function (req, res) {

    const firstUser = req.query.firstUser;
    const secondUser = req.query.secondUser; 
    if (firstUser && secondUser) {
        // get conversation between 2 users
        const conversation = await Conversation.findOne({
            $or : [
                {members: [firstUser, secondUser]},
                {members: [secondUser, firstUser]}
            ]
        });
        if (conversation)
            res.status(200).json(conversation);
        res.status(404).json("No conversation found");
    }
    else {
        // get all conversations
        const conversations = await Conversation.find();
        if (conversations)
            res.status(200).json(conversations);
        res.status(404).json("No conversation found");
    }
}

module.exports.create = async function (req, res) {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(201).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports.getConversationsByUserId = async function (req, res) {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        });
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
}


