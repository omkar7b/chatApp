const Message = require('../models/message');
const User = require('../models/user');
const Sequelize = require('sequelize');

exports.sendMessage = async (req, res, next) =>  {
    try {
        const {message} = req.body;
        console.log(message);
        if (!message) {
            return res.status(400).json({ error: 'Message cannot be null' });
          }
        const newMessage = await  Message.create({
            message: message,
            userId : req.user.id,
            name: req.user.name
        });
        res.status(201).json({success: true, newMessage});
    } catch (err) {
        console.log('Error at sendMessage Controller', err);
        res.status(500).json({success:false, error:err})
    }
};

exports.getMessage = async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        console.log(chatId)
        const messages = await Message.findAll({ where: { id: { [Sequelize.Op.gte]: chatId } } });
        console.log(messages);
        res.status(201).json({ message: messages });
    } catch (err) {
        res.status(500).json({ err: err, success: false });
    }
};
