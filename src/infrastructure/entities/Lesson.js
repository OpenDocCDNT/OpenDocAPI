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
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        publishDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lastEditedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reputation: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
