const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
const methodOverride = require('method-override');

const headers = {
  'X-Api-Key': process.env.API_KEY,
  'Accept': 'application/json'
}

// GET /parks - displays the list of all national parks
// router.get('/', function(req, res) {
//   axios.get('https://developer.nps.gov/api/v1/parks?', {headers})
//     .then(function(response) {
//       var parks = response.data;
//       //console.log("🐳🐳🐳 response from API: " + parks.data[1].fullName);
//       //res.json(parks)
//       res.render('parks/index', {parks: parks.data});
//   }).catch( function(err) {
//     res.json(err)
//   });
// });

// GET /parks - displays the list of national parks by state
router.get('/', function(req, res) {
  axios.get('https://developer.nps.gov/api/v1/parks?stateCode=' + req.query.states, {headers})
  .then(function(response) {
          var parks = response.data;
          //console.log("🐳🐳🐳 response from API: " + parks.data[1].fullName);
          //res.json(parks)
          res.render('parks/index', {parks: parks.data});
      }).catch( function(err) {
        res.json(err)
      });
});

// POST /parks - add park to the trip
// router.post('/', function(req, res) {
//   db.park.create({
//     name: req.body.name,
//     state: req.body.state,
//     coordinates: req.body.coordinates,
//     code: req.body.code
//   }).then(function(data) {
//     console.log("🌸DATA: " + data);
//     res.redirect('/parks');
//   })
// })
router.post('/', function(req, res) {
  db.park.create({
    name: req.body.name,
    state: req.body.state,
    coordinates: req.body.coordinates,
    code: req.body.code
    }).then((park) => {
      db.trip.findOrCreate({
        where: {
          destination: req.body.trip
        }
      }).spread(function(trip, created) {
        park.addTrip(trip)
          .then(function(){
            console.log("🐠🐠🐠done adding " + req.body.trip);
            res.redirect('/parks');
        })
      })
    }).catch((error) => {
      res.json(error);
    })
  });


//GET /parks/:id - renders show page with selected park
router.get('/:id', function(req, res) {
  db.park.findOne({
    where: {id: parseInt(req.params.id)},
    include: [db.trip]
  // }).then((park) => {
  //   if (!park) throw Error()
  //   res.render('parks/show', {park})
  // }).catch((error) => {
  //   res.status(400).render('main/404')
  // })
  }).then(function(data) {
    console.log("🌴🌴🌴 The park code is: " + data.code);
    let url = 'https://developer.nps.gov/api/v1/parks?parkCode=' + data.code;
    return axios.get(url, {headers})
  }).then(function(response) {
      var park = response.data.data[0];
      console.log(park);
      //res.json(park);
      res.render('parks/show', {park});
  }).catch(function(error) {
      console.log(error);
  })
});

//DELETE /parks/:id - delete park from a trip destination
router.delete('/:id', function(req, res) {
  db.park.destroy({
    where: {id: parseInt(req.params.id)},
    include: [db.trip]
  }).then(function(response) {
    console.log(response);
    res.redirect('/trips');
  })
});

module.exports = router;