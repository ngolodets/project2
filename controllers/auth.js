const express = require('express');
const db = require('../models');
const passport = require('../config/passportConfig');
const router = express.Router();


//GET /auth/signup - sends the signup form
router.get('/signup', function(req, res) {
  res.render('auth/signup');
});
//GET /auth/signup - receives the data from the form above
router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {email: req.body.email}, //this is where the data lands. This is how we look up the record in our db
    defaults: {
      name: req.body.name, 
      password: req.body.password
    }
  }).spread(function(user, created) { //can use .then(function([user, created}]) { instead of .spread....
    if (created) {
      console.log("💫💫💫 User was created, not found");
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: '⭐️ Account created and logged in! ⭐️'
      })(req, res); //this syntax/'iffy' function needs to be used b/c of passport
    } else {
      console.log("🔥🔥🔥 email already exists");
      req.flash('error', '🧟‍ Email alredy exists! 🧟');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log("⚡️⚡️⚡️Error: ", error.message);
    req.flash('error', error.message);
    res.redirect("/auth/signup");
  });
});

//GET /auth/login - sends the login form
router.get('/login', function(req, res) {
  res.render('auth/login');
});
//POST /auth/login - receives the data from the form above and does the authentication
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: '✅You have logged in!',
  failureFlash: '❌Invalid user name and/or password'
}));

//GET /auth/logout - deletes the session
router.get('/logout', function(req, res) {
  req.logout();                         //destroys/deletes the session
  console.log('🐽🐽🐽logged out');
  req.flash('success', '☢️You have logged out');
  res.redirect('/');                    //when no session exists, user is redirected to login page
});

module.exports = router;
