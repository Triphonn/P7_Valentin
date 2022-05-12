module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        avatar: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        postId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        content: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        file: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        likes: {
            allowNull: true,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        userLiked: {
            allowNull: true,
            type: DataTypes.STRING,
        },
    });
    return comment;
};
