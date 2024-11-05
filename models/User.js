// models/User.js
const { DataTypes } = require('sequelize');

function createUserModel(sequelize) {
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

    return User;
}

module.exports = createUserModel;
