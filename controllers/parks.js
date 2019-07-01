const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');

const headers = {
  'X-Api-Key': process.env.API_KEY,
  'Accept': 'application/json'
}

// GET /parks - displays the list of national parks
router.get('/', function(req, res) {
  axios.get('https://developer.nps.gov/api/v1/parks?', {headers})
    .then(function(response) {
      var parks = response.data;
      console.log("🐳🐳🐳 response from API: " + parks.data[1].fullName);
      //res.json(parks)
      res.render('parks/index', {parks: parks.data});
  }).catch( function(err) {
    res.json(err)
  });
});


//GET /parks/:id - renders show page with details of the park
router.get('/:id', function(req, res) {
  db.park.findOne({
    where: {id: parseInt(req.params.id)},
    include: [db.trip] //, db.comment, db.tag] 
  }).then(function(data) {
    console.log("🌴🌴🌴 The park code is: " + data.code);
    return axios.get('https://developer.nps.gov/api/v0/parks?parkCode=' + data.code, 
      {headers: config})
  }).then(function(response) {
      res.render('parks/show', {park: response.data});
  }).catch(function(error) {
      console.log(error);
  })
});

  








module.exports = router;