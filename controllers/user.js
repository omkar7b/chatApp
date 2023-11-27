const User = require('../models/user');
const bcrypt = require('bcrypt');

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

