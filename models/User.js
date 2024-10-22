const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
    LastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = User;
