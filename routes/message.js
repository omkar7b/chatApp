const express = require('express');
const router = express.Router();
const {sendMessage} = require('../controllers/message');
const userAuthentication = require('../middleware/auth');

router.post('/sendmessage', userAuthentication.authentication, sendMessage);

module.exports = router;