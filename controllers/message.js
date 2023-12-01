const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

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
        const lastRetrievedTimestamp = req.headers['last-retrieved-timestamp'] || 0;
        const userId = req.query.id; // Corrected: Use req.query.userId to get userId from query parameters
        const groupId = req.query.groupId;

        console.log('userId:', userId);
        console.log('groupId:', groupId);

        const messages = await Message.findAll({
            where: {
                userId: userId,
                groupId: groupId,
                createdAt: {
                    [Op.gt]: new Date(lastRetrievedTimestamp),
                },
            },
        });

        res.status(200).json({ messages: messages });
    } catch (err) {
        console.error('Error while fetching messages:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


 
