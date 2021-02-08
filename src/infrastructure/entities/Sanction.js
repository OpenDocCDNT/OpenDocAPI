const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('sanction', {
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
