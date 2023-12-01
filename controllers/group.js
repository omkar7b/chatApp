const Group = require('../models/group');
const  User = require('../models/user');
const Usergroup = require('../models/usergroup');


exports.createGroup = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        } 

        const { groupName } = req.body;
        const userId = req.params.id; // Corrected: Retrieve userId from params, assuming it's passed in the URL
        console.log('Received request with groupName:', groupName);
        console.log('userId:', userId);

        const newGroup = await Group.create({
            name: groupName
        });

        const userGroupAssociation = {
            userId: userId,
            groupId: newGroup.id
        };
        
        await Usergroup.create(userGroupAssociation);
            console.log('Users successfully associated with the group.');
            console.log('Group successfully created:', newGroup);

            res.status(201).json({ success: true, message: 'Group successfully created' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ err: err.stack, success: false });
    }
};


exports.getGroups = async (req, res, next) => {
    try {
        const userId = req.params.id; 
        const userGroups = await Usergroup.findAll({
            where: {userId: userId}
        })
       // Assuming you are passing the user ID in the URL
       if(userGroups.length>0){
        const groups = await Group.findAll({
            include: [{
                    model: User,
                    where: { id: userId},
                    through: {attributes: []}        // To exclude Usergroup attributes from the result
                }]
        })
        res.status(200).json({ success: true, groups: groups });
       }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error at getGroups' });
    }
};





