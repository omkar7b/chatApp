const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');
const Usergroup = require('../models/usergroup');

exports.sendMessage = async (req, res, next) =>  {
    try {
        const {message} = req.body;
        const groupId = req.params.groupId;
        console.log(groupId);
        console.log(message);
        if (!message) {
            return res.status(400).json({ error: 'Message cannot be null' });
          }
        const newMessage = await  Message.create({
            message: message,
            userId : req.user.id,
            name: req.user.name,
            groupId: groupId
        });
        res.status(201).json({success: true, newMessage});
    } catch (err) {
        console.log('Error at sendMessage Controller', err);
        res.status(500).json({success:false, error:err})
    }
};


exports.getMessage = async (req, res, next) => {
    try {
        const lastRetrievedTimestamp = req.query.lastretrievedtimestamp || 0;
        const userId = req.query.id; 
        const groupId = req.query.groupId;

        console.log('userId:', userId);
        console.log('groupId:', groupId);
        if (groupId === undefined) {
            return res.status(400).json({ success: false, error: 'groupId is undefined' });
        }
        const userGroup = await Usergroup.findAll({
            where:{
                groupId: groupId,
                userId: req.user.id
            }
        })

        if(userGroup.length>0){
            const messages = await Message.findAll({
                where: {
                    groupId: groupId,
                    createdAt: {
                       [Op.gt]: lastRetrievedTimestamp,
                   },
                },
            });
            console.log('Generated Sequelize Query:', messages);
        res.status(200).json({ messages: messages });
        }
        
    } catch (err) {
        console.error('Error while fetching messages:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


 
