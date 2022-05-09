const express = require('express');
// to parse application/json
const bodyParser = require('body-parser');
// Data Sanitization against NoSQL Injection Attacks
const mongoSanitize = require('express-mongo-sanitize');

// Routes de l'api
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const postRoutes = require('./routes/post');

const path = require('path');
const app = express();

const db = require('./db');

// Apply CORS policy
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());
//

// Prevent DOS attacks
app.use(express.json());
//

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//

//Connect database
db.sequelize.sync({ logging: false, force: false });
const dbConnection = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

dbConnection();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post', postRoutes);

module.exports = app;
