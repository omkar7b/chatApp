const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Message = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true 
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
    }
});

module.exports = Message;