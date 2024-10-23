const { Sequelize } = require('sequelize');

// Connection for PostgreSQL database

// Paste here you're connection string
// const connectionString = 'postgresql://<username>:<password>@<host>:<port>/<database>';



const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Zorg ervoor dat je dit alleen gebruikt voor test- of ontwikkelomgevingen
        }
    }
});

// Exporteren van de sequelize-instantie
module.exports = sequelize;
