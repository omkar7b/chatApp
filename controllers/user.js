const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup =  async (req, res, next) => {
    try {
        const {name, email, mobileNumber, password} = req.body;

        if(!name || !email || !mobileNumber || !password){
            return res.status(400).json({message: 'Bad Request'});
        }

        const userExist = await User.findOne({where: {email:email}});
        console.log(userExist);
        if(userExist){
            return res.status(409).json({message: 'User Already Exists, Please Login'})
        }
    
    bcrypt.hash(password ,10 , async(err, hash) => {
        if(err){
            console.log(err);
        }
        const newUser =  await User.create({
            name: name,
            email: email,
            mobileNumber: mobileNumber,
            password: hash
        });
        res.status(201).json({newUser});
        console.log(newUser);
    })    
    
    } catch (error) {
        console.error('Sequelize error:', error);
        console.error('err at controller')
        res.status(500).json({error: 'User Not Created'});
    }   
}

function generateAccessToken(id, name){
    return jwt.sign({userId: id, name: name}, process.env.SECRET_KEY)
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const userExist = await User.findAll({where: {email: email}});

        if(userExist.length>0){
            bcrypt.compare(password, userExist[0].password, (err, result) => {
                if(err){
                    console.log('err at bcrypt', err);
                }
                else if(result===true){
                    res.status(200).json({success:true, message:'User Logged in successfully', token: generateAccessToken(userExist[0].id, userExist[0].name)});
                }
                else {
                    res.status(401).json({success:false, message:'User Not Authorized'});
                };
            });
        } else {
            throw new Error('User Not Found')
        };
    } catch (error) {
        if (error.message === 'User Not Found') {
            return res.status(404).json({success: false, message: 'User Not Found'});
        } else {
            console.error(error);
            return res.status(500).json({success: false, message: 'Internal Server Error'});
        };
    };
};