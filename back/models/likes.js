module.exports = (sequelize, DataTypes) => {
    const likes = sequelize.define('likes', {
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        postId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
    });
    return likes;
};
