const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');
const Usergroup = require('../models/usergroup');
const AWS = require('aws-sdk');

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

exports.sendMedia = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id;
        console.log(groupId,'<<<<')
        const { files } = req;
        const file = files.media;
        if (!file) {
            console.log('no files found')
        }
        const groups = await req.user.getGroups({ where: { id: groupId } })

        if (groups) {
            let type;
            if (file.mimetype.startsWith('image')) {
                type = 'image';
            } else if (file.mimetype.startsWith('video')) {
                type = 'video';
            } else {
                type = 'other';
            }

            let name = file.name;
            const ext = name.slice(name.lastIndexOf('.') + 1);
            const filename = `Images/${userId}/${groupId}/${new Date()}.${ext}`;
            const fileUrl = await uploadToS3(file.data, filename);

            await req.user.createMessage({
                message: fileUrl,
                name: req.user.name,
                groupId: groupId,
            })

            res.status(200).json({ success: true, message: 'media saved in db' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occured at media saving', err: error })
    }

}

function uploadToS3(data, filename) {
    let s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
    })

    let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read',
    }

    return new Promise((res, rej) => {
        s3Bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something Went Wrong at s3 upload', err);
                rej(err);
            } else {
                res(s3response.Location);
            }
        })
    })
}
 
