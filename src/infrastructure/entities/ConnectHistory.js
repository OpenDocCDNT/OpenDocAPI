const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('connectHistory', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        connectDate: {
            type: DataTypes.DATE,
            allowNul: false
        },
        disconectDate: {
            type: DataTypes.DATE,
            allowNul: false
        }
    },
    {
        timestamps:false,
        freezeTableName: true
    });  
};