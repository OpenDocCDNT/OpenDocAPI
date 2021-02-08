const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categoryName: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    categoryImgUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryShortDescription: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    categoryLongDescription: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
