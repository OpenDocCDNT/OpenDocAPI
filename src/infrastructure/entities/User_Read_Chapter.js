const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('user_read_chapter', {
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
