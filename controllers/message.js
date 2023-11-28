const Message = require('../models/message');
const User = require('../models/user');

exports.sendMessage = async (req, res, next) =>  {
    try {
        const {message} = req.body;
        console.log(message);
        if (!message) {
            return res.status(400).json({ error: 'Message cannot be null' });
          }
        const newMessage = await  Message.create({
            message: message,
            userId : req.user.id
        });
        res.status(201).json({success: true, message: 'Message Sent SuccessFully'});
    } catch (err) {
        console.log('Error at sendMessage Controller', err);
        res.status(500).json({success:false, error:err})
    }
};

