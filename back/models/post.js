module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        _id: {
            allowNull: false,
            type: DataTypes.BIGINT,
            primarykey: true,
            unique: true,
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
    return Post;
};
