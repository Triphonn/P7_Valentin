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
        file: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        upvotes: {
            allowNull: true,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        downvotes: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        usersUpvoted: {
            allowNull: false,
            type: DataTypes.STRING,
            defaultValue: '',
        },
        usersDownvoted: {
            allowNull: false,
            type: DataTypes.STRING,
            defaultValue: '',
        },
    });
    return post;
};
