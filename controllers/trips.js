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


module.exports = router;