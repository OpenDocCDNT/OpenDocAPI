const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('user_has_role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
