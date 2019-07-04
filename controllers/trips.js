const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /trips - show ALL the trips that exist
router.get('/', function(req, res) {
  db.trip.findAll({
    include: [db.user]
  }).then(function(trips) {
    console.log("trips: " + trips);
    res.render('trips/index', {trips});
  });
});

// POST /trips - create a new trip
// router.post('/', (req, res) => {
//   db.park.create({
//     name: req.body.name,
//     state: req.body.state,
//     coordinates: req.body.coordinates,
//     code: req.body.code
//   }).then((park) => {
//       db.trip.findOrCreate({
//         where: {
//           destination: req.body.trip
//         }
//           }).spread(function(trip, created) {
//             park.addTrip(trip)
//               .then(function(){
//                 console.log("🐠🐠🐠done adding " + req.body.trip);
//                 res.redirect('/trips');
//         })
//       })
//     }).catch((error) => {
//       res.json(error);
//     })
// });

// // GET /trips/new - display form for creating a new trip
// router.get('/new', (req, res) => {
//   res.render('trips/new');
// });

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
      console.log(response);
      res.redirect('/trips');
  });
});

module.exports = router;