const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('User_Read_Chapters', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
