const express = require('express');
const router = express.Router();
const controller = require('../controllers/key.controller');

// store key of a user
router.post('/', controller.create);

// get public key of a user 
router.get('/:userId', controller.getPublicKeyByUserId);



module.exports = router;