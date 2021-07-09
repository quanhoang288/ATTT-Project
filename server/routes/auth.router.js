const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');


router.post('/signin', controller.signin);
router.post('/signup', controller.signup);

module.exports = router;