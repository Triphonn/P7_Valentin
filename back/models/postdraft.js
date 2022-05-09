module.exports = (sequelize, DataTypes) => {
    const postDraft = sequelize.define('postDraft', {
        _id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        content: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        file: {
            allowNull: true,
            type: DataTypes.STRING,
        },
    });
    return postDraft;
};
