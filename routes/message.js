const express = require('express');
const router = express.Router();
const {sendMessage, getMessage} = require('../controllers/message');
const userAuthentication = require('../middleware/auth');

router.post('/sendmessage', userAuthentication.authentication, sendMessage);
router.get('/getmessage/:chatId', userAuthentication.authentication, getMessage);

module.exports = router;