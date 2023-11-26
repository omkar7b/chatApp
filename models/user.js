const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true 
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    mobileNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    password: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = User;