const express = require('express');
const router = express.Router();
const db = require('../models');

const headers = {
  'X-Api-Key': process.env.API_KEY,
  'Accept': 'application/json'
}

// GET /trips - show ALL the trips that exist
router.get('/', function(req, res) {
  db.trip.findAll({
    where: {userId: req.user.id},
    include: [db.user, db.park]
  }).then(function(trips) {
    res.render('trips/index', {trips});
  });
});

//GET /trips/:id - show a specific trip 
router.get('/:id', function(req, res) {
  db.trip.findOne( {
    where: {id: parseInt(req.params.id)},
    include: [db.park, db.user]
  })
    .then(function(trip) {
      res.render('trips/show', {trip});  
  });
});

//DELETE /trips/:id - delete trip destination
router.delete('/:id', function(req, res) {
  db.trip.destroy({
    where: {id: parseInt(req.params.id)},
    include: [db.park, db.user]
  })
    .then(function(response) {
      res.redirect('/trips');
  });
});

module.exports = router;