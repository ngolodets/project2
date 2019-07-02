const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /trips - show ALL the trips that exist
router.get('/', function(req, res) {
  db.trip.findAll().then(function(trips) {
    console.log("trips: " + trips);
    res.render('trips/index', {trips});
  });
});

//GET /trips/:id - show a specific trip and all the parks with that trip
router.get('/:id', function(req, res) {
  db.trip.findOne( {
    where: {id: parseInt(req.params.id)},
    include: [db.park]
  }).then(function(trip) {
      res.render('trips/show', {trip});  
  });
});


module.exports = router;