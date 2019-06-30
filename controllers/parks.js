const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');

//axios.defaults.baseURL = 'https://developer.nps.gov/api/v1';
//axios.defaults.headers.common['X-Api-Key'] = API_KEY;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// const instance = axios.create({
//   baseURL: 'https://developer.nps.gov/api/v1/parks?',
//   timeout: 1000,
//   headers: {'X-Api-Key': 'API_KEY' }
// });
//axios.defaults.headers.common['X-Api-Key'] = "API_KEY";
//axios.get('https://developer.nps.gov/api/v0/parks?parkCode=yell')


let config = {'X-Api-Key': 'API_KEY'};

// GET /parks - displays the list of national parks
router.get('/parks', function(req, res) {
  res.render('parks/index', { parks: response.data })
  axios.get('https://developer.nps.gov/api/v0/parks?',
    {headers: config})
      .then(function(response) {
        console.log("🐳🐳🐳 response from API: " + resoponse.data);
        res.render('parks/index', { parks: response.data }); 
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