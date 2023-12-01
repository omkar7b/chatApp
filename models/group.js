// group.js
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('groups', {
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
    }
});

module.exports = Group;
