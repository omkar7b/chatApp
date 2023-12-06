const express = require('express');
const router = express.Router();
const {sendMessage, getMessage, sendMedia} = require('../controllers/message');
const userAuthentication = require('../middleware/auth');

router.post('/sendmessage/:groupId', userAuthentication.authentication, sendMessage);
router.get('/getmessage', userAuthentication.authentication, getMessage);
router.post('/mediasharing/:groupId', userAuthentication.authentication, sendMedia);

module.exports = router;