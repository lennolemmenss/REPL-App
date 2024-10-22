const { Sequelize } = require('sequelize');

// Connection string voor je PostgreSQL database
const connectionString = 'postgresql://postgres:2DuWjFIzrCDp4mYH@faithlessly-exotic-char.data-1.use1.tembo.io:5432/postgres';

// Sequelize-instantie aanmaken met de configuratie
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
