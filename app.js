const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/user');


const sequelize = require('./util/database');

const app = express();

app.use(bodyParser.json({extended: false}));
app.use(cors());

app.post('/user/signup', async (req,res,next) => {
    try {
        const {name, email, mobileNumber, password} = req.body;

    const newUser =  await User.create({
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        password: password
    });
    res.status(201).json({newUser});
    console.log(newUser);
    } catch (error) {
        console.error('err at controller')
        res.status(500).json({error: 'User Not Created'});
    }   
})

sequelize.sync()
.then(() => {
    app.listen(3000);
    console.log('success');
})
.catch((err) => {
    console.log(err);
})
