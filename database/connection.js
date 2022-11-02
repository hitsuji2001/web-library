const mysql = require("mysql");
const connectionPool = mysql.createPool({
    connectionLimit	: 10,
    host		: process.env.DB_HOST,
    user		: process.env.DB_USER,
    password		: process.env.DB_PASS,
    database		: process.env.DB_SCHEMA
});

connectionPool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Successfully connected to the database');
});

module.exports = connectionPool;
