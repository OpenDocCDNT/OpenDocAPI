const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('chapter', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        label: {
            type: DataTypes.STRING(150),
            allowNull: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
