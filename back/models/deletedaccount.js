module.exports = (sequelize, DataTypes) => {
    const deletedAccount = sequelize.define('deletedAccount', {
        userId: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
        },
        bio: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        profilePicture: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        banner: {
            allowNull: true,
            type: DataTypes.STRING,
        },
    });
    return deletedAccount;
};
