const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
const methodOverride = require('method-override');

const headers = {
  'X-Api-Key': process.env.API_KEY,
  'Accept': 'application/json'
}

// GET /parks - displays the list of national parks
router.get('/', function(req, res) {
  axios.get('https://developer.nps.gov/api/v1/parks?', {headers})
    .then(function(response) {
      var parks = response.data;
      //console.log("🐳🐳🐳 response from API: " + parks.data[1].fullName);
      //res.json(parks)
      res.render('parks/index', {parks: parks.data});
  }).catch( function(err) {
    res.json(err)
  });
});

// POST /parks - add park to the favorites list
router.post('/', function(req, res) {
  db.park.create({
    name: req.body.name,
    state: req.body.state,
    coordinates: req.body.coordinates,
    code: req.body.code
  }).then(function(data) {
    console.log("🌸DATA: " + data);
    res.redirect('/parks');
  })
})
// router.post('/', function(req, res) {
//   db.park.create({
//     name: req.body.name,
//     state: req.body.state,
//     coordinates: req.body.coordinates,
//     code: req.body.code
//     }).then((park) => {
//       db.trip.findOrCreate({
//         where: {
//           name: req.body.trip
//         }
//       }).spread(function(category, created) {
//         park.addTrip(trip)
//           .then(function(){
//             console.log("🐠🐠🐠done adding " + req.body.trip);
//             res.redirect('/');
//         })
//       })
//     }).catch((error) => {
//       res.json(error);
//     })
//   });


//GET /parks/:id - renders show page with selected parks
router.get('/:id', function(req, res) {
  db.park.findOne({
    where: {id: parseInt(req.params.id)},
    //include: [db.trip]  
  }).then(function(data) {
    console.log("🌴🌴🌴 The park code is: " + req.params.code);
    return axios.get('https://developer.nps.gov/api/v1/parks?parkCode=' + req.params.code, 
      {headers})
  }).then(function(response) {
      var park = response.data;
      res.render('parks/show', {park: park.data});
  }).catch(function(error) {
      console.log(error);
  })
});

  




module.exports = router;