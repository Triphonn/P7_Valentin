module.exports = (sequelize, DataTypes) => {
    const userProfile = sequelize.define('userProfile', {
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            primaryKey: true,
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
    return userProfile;
};
