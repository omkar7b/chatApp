const {Group, Admin} = require('../models/group');
const  User = require('../models/user');
const Usergroup = require('../models/usergroup');
const { Op } = require('sequelize');

exports.createGroup = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const { groupName } = req.body;
    const userId = req.params.id;

    const existingGroup = await Group.findOne({ where: { name: groupName } });
    if (existingGroup) {
      return res.status(400).json({ success: false, error: 'Group with this name already exists' });
    }

    const user = await User.findOne({ where: { id: req.user.id } });

    const newGroup = await Group.create({ name: groupName });

    // Associate user with the new group
    await user.addGroup(newGroup);

    const admin = await user.createAdmin({ isAdmin: true });

    // Associate admin with the new group
    await newGroup.addAdmin(admin);

    const userGroupAssociation = {
      userId: userId,
      groupId: newGroup.id,
    };

    
    const existingUserGroup = await Usergroup.findOne({
      where: {
        userId: userId,
        groupId: newGroup.id,
      },
    });

    if (!existingUserGroup) {
      // Associate user with the new group
      await Usergroup.create(userGroupAssociation);
      console.log('User successfully associated with the group.');
      console.log('User-group association created:', userGroupAssociation);
    } else {
      console.log('User-group association already exists:', existingUserGroup);
    }

    console.log('Group successfully created:', newGroup);

    res.status(201).json({ success: true, message: 'Group successfully created', newGroup: newGroup });
  } catch (error) {
    console.error('Error in createGroup route:', error);
    res.status(500).json({ error: error.stack, success: false });
  }
};





exports.getGroups = async (req, res, next) => {
    try {
     //   const userId = req.params.id; 
        const userGroups = await Usergroup.findAll({
            where: {userId: req.user.id}
        })
       
       if(userGroups.length>0){
        const groups = await Group.findAll({
            include: [{
                    model: User,
                    where: { id: req.user.id},
                    through: {attributes: []}      
                }]
        })
        res.status(200).json({ success: true, groups: groups });
       }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error at getGroups' });
    }
};

exports.isGroupMember = async (req, res) => {
    try {
        console.log('isGroupMember controller called');
        const userId = req.params.userId;
        const groupId = req.params.groupId;
        console.log('userId:', userId);
        console.log('groupId:', groupId);
        const userGroup = await Usergroup.findOne({
        where: {
            userId: userId,
            groupId: groupId,
        }
    })
    res.status(200).json({ userGroup });
    } catch (error) {
        console.log('Error in isGroupMember:', error);
        res.status(500).json({ err: error, message: 'err at isGroupMember' });
    }
};

exports.addUserToGroup = async (req, res) => {
    try {
        const { email } = req.body;
        const groupId = req.params.groupId;
        console.log(email);
        console.log(groupId);
        const admin = await Admin.findOne({ where: { userId: req.user.id, groupId: groupId, isAdmin: true } });
        if (!admin) {
            throw new Error('Only admins can add users to the group.');
        }
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new Error('User not found.');
        }
        const group = await Group.findByPk(groupId);
        if (!group) {
            throw new Error('Group not found.');
        }
        await user.addGroup(group);
        res.status(200).json({ success: true });
    } catch (err) {
        console.log('Error at addUser Controller', err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.removeUserFromGroup = async (req, res) => {
   try {
        const groupId = req.params.groupId;
         const email = req.body.email;
         console.log('>>>>>', email);
         const admin = await Admin.findOne({ where: { userId: req.user.id, groupId: groupId, isAdmin: true } });
         const user = await User.findOne({ where: { email: email } });
        
         if (user.id == req.user.id || (admin.isAdmin == true)) {
            const group = await Group.findByPk(groupId);
             if (!user || !group) {
                 throw new Error('User or Group Not Found');
             }
             const isUserAdmin = await Admin.findOne({
                 where: {
                     groupId: groupId,
                    userId: user.id,
                }
             })
            if (isUserAdmin) {
                await Admin.destroy({
                    where: {
                        id: isUserAdmin.id
                    }
                })
            }
            await user.removeGroup(group);
            res.status(200).json({ success: true, message: 'user removed' })
        };
   }
     catch (error) {
         console.log(error)
         res.status(500).json({ err: error, success: false, message: 'only admin can remove user' });
     };
 };

exports.getAdmin = async (req, res) => {
    try {
        const groupId = +req.query.groupId;
        const userId = +req.query.userId;
        const userGroup = await Usergroup.findOne({
            where: {
                userId: userId,
                groupId: groupId,
            }
        })
        const admins = await Admin.findAll({
            where: { groupId: groupId, isAdmin: true },
        })
        res.status(200).json({ admins, userGroup })
    }
    catch (error) {
        res.status(500).json({ err: error, message: 'Something wrong at getAdmin' })
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const email = req.body.email;
        console.log(groupId, email);

        const admin = await Admin.findOne({ where: { userId: req.user.id, groupId: groupId, isAdmin: true } });

        if (admin && admin.isAdmin) {
            const user = await User.findOne({ where: { email: email } });
            const group = await Group.findByPk(groupId);

            await Admin.create({ userId: user.id, groupId: group.id, isAdmin: true });

            res.status(200).json({ success: true, message: 'You are Admin now' });
        } else {
            throw new Error('Only admin have access');
        }
    } catch (error) {
        console.error('Error in makeAdmin controller:', error);
        res.status(500).json({ err: error, success: false, message: 'Internal Server Error' });
    }
};

       
exports.removeAdmin = async (req, res) => {
    try {
        const groupId = +req.query.groupId;
        const userId = +req.query.userId;
        console.log('admin to be removed', userId,groupId);

        const admin = await Admin.findOne({ where: { userId: userId, groupId: groupId, isAdmin: true } });
        console.log(admin);

        if (admin && admin.isAdmin) {
            await Admin.destroy({ where: { userId: userId, groupId: groupId } })
            res.status(200).json({ message: 'Admin Removed' })
        } else {
            res.status(403).json({ message: 'Only Admins have this access' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ err: error, message: 'Internal Server Error' });
    }
}
        


