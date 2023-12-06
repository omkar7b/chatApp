const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const socketIo = require('socket.io');
const http = require('http');
const path =require('path');
const fileUpload = require('express-fileupload');


const app = express();

const server = http.createServer(app);
const io = socketIo(server);


app.use(bodyParser.json({extended: true}));
app.use(fileUpload());

app.use(cors({
    origin: ['http://localhost:3000','http://127.0.0.1:5500'],
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

app.use(express.static(path.join(__dirname, 'views')));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `${req.url}`));
})

io.on('connection', socket => { 

    socket.on('send-message', (message) => {
        io.emit('receive-message', message);
    });

    socket.on('userAdded', () => {
        io.emit('userAdded');
    })

    socket.on('userRemoved', () => {
        io.emit('userRemoved');
    })

    socket.on('adminAdded', () => {
        io.emit('adminAdded');
    })

    socket.on('adminRemoved', () => {
        io.emit('adminRemoved');
    })
});


sequelize.sync()
.then(() => {
    server.listen(3000);
    console.log('Server is running on port 3000');
})
.catch((err) => {
    console.log(err);
})

