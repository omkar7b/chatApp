const express = require('express');
const router = express.Router();
const {signup, login, getAllUsers} = require('../controllers/user');
const userAuthentication = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/getallusers/:groupId', userAuthentication.authentication, getAllUsers);

module.exports = router;