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
    });
    return comment;
};
