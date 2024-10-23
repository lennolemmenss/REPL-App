const { Sequelize } = require('sequelize');

// Connection for PostgreSQL database

// Paste here you're connection string
const connectionString = 'postgresql://<username>:<password>@<host>:<port>/<database>';



const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});


module.exports = sequelize;
