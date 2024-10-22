const { Pool } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:2DuWjFIzrCDp4mYH@faithlessly-exotic-char.data-1.use1.tembo.io:5432/postgres';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool; 
