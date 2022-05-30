module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
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
        content: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        image: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        video: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        likes: {
            allowNull: true,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        comments: {
            allowNull: true,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
    return post;
};
