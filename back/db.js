const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config();

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB,
    process.env.MYSQL_ADDON_USER,
    process.env.MYSQL_ADDON_PASSWORD,
    {
        host: process.env.MYSQL_ADDON_HOST,
        dialect: 'mysql',
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require('./models/signup')(sequelize, DataTypes);
db.posts = require('./models/post')(sequelize, DataTypes);
db.likes = require('./models/likes')(sequelize, DataTypes);
db.comments = require('./models/comment')(sequelize, DataTypes);
db.userProfile = require('./models/userProfile')(sequelize, DataTypes);

module.exports = db;
