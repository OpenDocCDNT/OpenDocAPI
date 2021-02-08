const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleName: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        roleColor: {
            type: DataTypes.STRING(16),
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
