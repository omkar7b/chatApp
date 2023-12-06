const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Archivedchats = sequelize.define('archivedchats', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    message: Sequelize.STRING,
})

module.exports = Archivedchats;
//