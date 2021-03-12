const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        job: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        registerDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
