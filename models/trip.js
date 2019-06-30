'use strict';
module.exports = (sequelize, DataTypes) => {
  const trip = sequelize.define('trip', {
    destination: DataTypes.STRING,
    campground: DataTypes.TEXT,
    event: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  trip.associate = function(models) {
    // associations can be defined here
    models.trip.belongsTo(models.profile);
    models.trip.hasMany(models.park);
  };
  return trip;
};