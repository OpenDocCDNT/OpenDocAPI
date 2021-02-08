const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('subcategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subCategoryName: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    subCategoryImgUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subCategoryShortDescription: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    subCategoryLongDescription: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
