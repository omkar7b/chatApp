const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json({extended: false}));
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
}));


const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const groupRoutes = require('./routes/group');

const  User = require('./models/user');
const Usergroup = require('./models/usergroup');
const Message = require('./models/message');
const {Group, Admin} = require('./models/group');
const sequelize = require('./util/database');


app.use('/user',userRoutes);
app.use('/message', messageRoutes);
app.use('/group', groupRoutes);

User.hasMany(Message);
Message.belongsTo(User);

User.belongsToMany(Group, { through: Usergroup });
Group.belongsToMany(User, { through: Usergroup });

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Admin);
Admin.belongsTo(User);
Group.hasMany(Admin);
Admin.belongsTo(Group);

sequelize.sync({force:true})
.then(() => {
    app.listen(3000);
    console.log('Server is running on port 3000');
})
.catch((err) => {
    console.log(err);
})
