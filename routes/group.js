const express = require('express');
const router = express.Router();
const {createGroup, getGroups, isGroupMember, addUserToGroup, removeUserFromGroup, getAdmin, makeAdmin, removeAdmin} = require('../controllers/group');
const userAuthentication = require('../middleware/auth');

router.post('/creategroup/:id', userAuthentication.authentication, createGroup);
router.get('/getgroups/:id', userAuthentication.authentication, getGroups);
router.get('/isgroupmember/:groupId/:userId', userAuthentication.authentication, isGroupMember);
router.post('/addtogroup/:groupId', userAuthentication.authentication, addUserToGroup);
router.post('/removeuser/:groupId',userAuthentication.authentication, removeUserFromGroup);
router.get('/getadmins', userAuthentication.authentication, getAdmin);
router.post('/makeadmin/:groupId', userAuthentication.authentication, makeAdmin);
router.post('/removeadmin', userAuthentication.authentication, removeAdmin);


module.exports = router;



