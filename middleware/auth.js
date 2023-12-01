const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Usergroup = require('../models/usergroup');

const authentication = async (req, res, next) => {
    try {
    const token = req.header('Authorization');
    console.log(token);
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(decode.userId);
    req.user = user;
    next();

    } catch (err){
        console.log('error at authentication', err);
        return res.json(401).json({success: false, meesage: 'User Not Authorized'});
    }
}

module.exports = {
    authentication
};


