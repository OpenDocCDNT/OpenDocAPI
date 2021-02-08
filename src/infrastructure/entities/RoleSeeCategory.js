const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('role_see_category', {
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
