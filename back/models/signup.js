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
    });
    return User;
};
