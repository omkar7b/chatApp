const express = require('express');
const router = express.Router();
const {createGroup, getGroups} = require('../controllers/group');
const userAuthentication = require('../middleware/auth');

router.post('/creategroup/:id', userAuthentication.authentication, createGroup);
router.get('/getgroups/:id', userAuthentication.authentication, getGroups);

module.exports = router;



