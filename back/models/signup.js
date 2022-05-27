module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        isAdmin: {
            allowNull: true,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
    return User;
};
