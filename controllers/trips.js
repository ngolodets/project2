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
    console.log("trips: " + trips);
    res.render('trips/index', {trips});
  });
});

// POST /trips - create a new trip
// router.post('/', (req, res) => {
//   db.trip.create({
//     destination: req.body.trip,
//     userId: req.user.id,
//     include: [db.park]
//   }).then(function(trip) {
//     console.log('HEEEEEERRRRRRREEEEEE!!!!!>>>>>>>>>>>>>>>>>>')
//     // call the api to get data to write to your db
//     // axios.get('https://developer.nps.gov/api/v1/parks?stateCode=' + req.query.states, {headers})
//     //   .then(function(response) {

//     //   })
//     db.park.findOrCreate({
//       where: {
//         // name: req.body.name,
//         // state: req.body.state,
//         // coordinates: req.body.coordinates,
//         code: req.body.park
//       }
//     }).spread(function(park, created) {
//       trip.addPark(park)
//         .then(function(){
//           console.log("🐠🐠🐠done adding " + req.body.park);
//           res.redirect('trips/index');
//         })
//     })
//     // console.log("🌎🌎 the trip is: ", trip);
//     // res.redirect('trips/index');
//   });
// });
// router.post('/', function(req, res) {
//   db.park.create({
//     name: req.body.name,
//     state: req.body.state,
//     coordinates: req.body.coordinates,
//     code: req.body.code
//     }).then((park) => {
//       db.trip.findOrCreate({
//         where: {
//           destination: req.body.trip
//         }
//       }).spread(function(trip, created) {
//         park.addTrip(trip)
//           .then(function(){
//             console.log("🐠🐠🐠done adding " + req.body.trip);
//             res.redirect('/trips');
//         })
//       })
//     }).catch((error) => {
//       res.json(error);
//     })
//   });


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