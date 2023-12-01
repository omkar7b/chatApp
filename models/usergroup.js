// usergroup.js
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Group = require('./group');

const Usergroup = sequelize.define('usergroups', {
    userId: {
        type: Sequelize.INTEGER,
        references: {  
            model: User,
            key: 'id',
        }
    },
    groupId: {
        type: Sequelize.INTEGER,
        references: {  
            model: Group,
            key: 'id',
        }
    }
});

module.exports = Usergroup;
