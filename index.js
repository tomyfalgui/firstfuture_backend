// IMPORTS
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const fileUpload = require('express-fileupload');
require('./passport.js');

// Router Imports
var users = require('./routes/users');
var companies = require('./routes/companies');
var bookmarks = require('./routes/bookmarks');
var applications = require('./routes/applications');
var listings = require('./routes/listings');
var auth = require('./routes/auth');

var app = express();

// Global App Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.raw({ inflate: true, limit: '100kb'}));
app.use(fileUpload());
app.use(cors());

// Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/companies', companies, passport.authenticate('company-jwt', { session: false }), companies);
app.use('/api/bookmarks', [passport.authenticate('jwt', { session: false })], bookmarks);
app.use('/api/apply', [passport.authenticate('jwt', { session: false })], applications);
app.use('/api/listings', listings);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Application starting");
});