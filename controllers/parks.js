const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');
const methodOverride = require('method-override');

const headers = {
  'X-Api-Key': process.env.API_KEY,
  'Accept': 'application/json'
}

// GET /parks - displays the list of national parks by state
router.get('/', function(req, res) {
  axios.get('https://developer.nps.gov/api/v1/parks?stateCode=' + req.query.states, {headers})
    .then(function(response) {
      var parks = response.data;
      res.render('parks/index', {parks: parks.data});
    })
      .catch( function(err) {
        res.json(err)
      });
});

// POST /parks - add park to the trip
router.post('/', function(req, res) {
  db.park.create({
    name: req.body.name,
    state: req.body.state,
    coordinates: req.body.coordinates,
    code: req.body.code
    }).then((park) => {
      db.trip.findOrCreate({
        where: {
          destination: req.body.trip,
          userId: req.user.id
        }
      }).spread(function(trip, created) {
        park.addTrip(trip)
          .then(function(){
            res.redirect('/trips');
        })
      })
    }).catch((error) => {
      res.json(error);
    });
  });

//GET /parks/:id - renders show page with selected park
router.get('/:id', function(req, res) {
  db.park.findOne({
    where: {id: parseInt(req.params.id)},
    include: [db.trip]
  }).then(function(data) {
    let url = 'https://developer.nps.gov/api/v1/parks?parkCode=' + data.code;
    axios.get(url, {headers})
      .then(function(response){
        var park = response.data.data[0];
        let url = 'https://developer.nps.gov/api/v1/campgrounds?parkCode=' + park.parkCode;
        axios.get(url, {headers})
          .then(function(response){
            var campgrounds = response.data;
            let url = 'https://developer.nps.gov/api/v1/events?parkCode=' + park.parkCode;
            axios.get(url, {headers})
              .then(function(response) {
                var events = response.data;
                res.render('parks/show', {park, campgrounds: campgrounds, events: events});
            })
          })     
        }).catch(function(error) {
          console.log(error);
        })
    });
});

//DELETE /parks/:id - delete park from a trip destination
router.delete('/:id', function(req, res) {
  db.park.destroy({
    where: {id: parseInt(req.params.id)},
    include: [db.trip]
  }).then(function(response) {
    res.redirect('/trips');
  });
});

//PUT /parks/:id - updates park name
router.put('/:id', function(req, res) {
  db.park.update({
    name: req.body.name
  }, {
    where: {id: parseInt(req.params.id)},
    include: [db.trip]
  }).then(function(response) {
    res.redirect('/trips');
  });
});

module.exports = router;