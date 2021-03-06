require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
//Module that allows use/creation of sessions
const session = require('express-session');
//Imports passport local strategy
const passport = require('./config/passportConfig');
//Module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mapbox({
  accessToken: process.env.MAPBOX_TOKEN
});

//This is ONLY used by the session store
const db = require('./models');

const app = express();

//geocoding setup
// const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocodingClient = mapbox({
//   accessToken: process.env.MAPBOX_TOKEN
// })

//This line makes the session use sequelize to write session data to a postgres table
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
});

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.set('layout extractScripts', true);
app.use(methodOverride('_method'));
app.use(helmet());

// Configures express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

//Use this line once to set up the store table
sessionStore.sync();

//Starts the flash middleware
app.use(flash());

// Link passport to the express session
// MUST BE BELOW SESSION
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

// GET /search - take out parameters and hit mapbox geocoding
app.get('/search', function(req, res) {
  let location = req.query.city + ", " + req.query.state;
  //Seattle, WA

  //use geocoder to query the location with sushi appended to the query
  //then, take response from mapbox and render show with the data
  geocodingClient.forwardGeocode({
    query: "sushi " + location
  }).send().then(function(response){
    let results = response.body.features.map(function(feature) {
      return feature.center
    })
    //res.json({results})
    console.log("Map Search results: ", results);
    res.render('map', {results})
  });
});

app.use('/auth', require('./controllers/auth'));
app.use('/parks', require('./controllers/parks'));
app.use('/trips', require('./controllers/trips'));

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("🐉🐉🐉 listening...");
});

module.exports = server;
