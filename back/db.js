const express = require('express');
const mysql = require('mysql');
const app = express();

require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_GROUPOMANIA_USERNAME,
    password: process.env.DB_GROUPOMANIA_PASSWORD,
    database: process.env.DB_GROUPOMANIA_NAME,
});

db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + db.threadId);
});

module.exports = db;
