const express = require('express');
const router = express.Router();
const controller = require('../controllers/message.controller');

// create a new message
router.post('/', controller.create);

// get all messages of a conversation 
router.get('/:conversationId', controller.getMessagesByConversationId);

// get latest message of a conversation 
router.get('/:conversationId/latest', controller.getLatestMessageByConversationId);

module.exports = router;