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
db.userProfile = require('./models/userProfile')(sequelize, DataTypes);
db.postdraft = require('./models/postdraft')(sequelize, DataTypes);
db.deletedaccount = require('./models/deletedaccount')(sequelize, DataTypes);

module.exports = db;
