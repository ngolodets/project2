'use strict';
module.exports = (sequelize, DataTypes) => {
  const park = sequelize.define('park', {
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    coordinates: DataTypes.STRING,
    code: DataTypes.STRING
  }, {});
  park.associate = function(models) {
    // associations can be defined here
  };
  return park;
};