'use strict';
module.exports = (sequelize, DataTypes) => {
  const park = sequelize.define('park', {
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    coordinates: DataTypes.STRING,
    code: DataTypes.STRING,
    description: DataTypes.TEXT,
    tripId: DataTypes.INTEGER
  }, {});
  park.associate = function(models) {
    // associations can be defined here
    models.park.belongsTo(models.trip);
  };
  return park;
};