'use strict';
module.exports = (sequelize, DataTypes) => {
  const tripsParks = sequelize.define('tripsParks', {
    tripId: DataTypes.INTEGER,
    parkId: DataTypes.INTEGER
  }, {});
  tripsParks.associate = function(models) {
    // associations can be defined here
  };
  return tripsParks;
};