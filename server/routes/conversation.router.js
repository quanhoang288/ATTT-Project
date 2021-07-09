const router = require('express').Router();
const controller = require('../controllers/conversation.controller');


// create new conversation 
router.post('/', controller.create);

// get conversation between 2 users 
router.get('/', controller.findAll);

// get all conversation of a users
router.get('/:userId', controller.getConversationsByUserId);


module.exports = router;