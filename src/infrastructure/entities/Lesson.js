const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('lesson', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        label: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        publishDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        lastEditedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reputation: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imgBlob: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
