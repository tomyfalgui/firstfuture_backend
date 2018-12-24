// IMPORTS
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

// Router Imports
var users = require('./routes/users');
var companies = require('./routes/companies');
var bookmarks = require('./routes/bookmarks');
let applications = require('./routes/applications');
let listings = require('./routes/listings');

var app = express();

// Global App Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

// JWT
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

// Routes
app.use('/api/users', users);
app.use('/api/companies', companies);
app.use('/api/bookmarks', bookmarks);
app.use('/api/applications', applications);
app.use('/api/listings', listings);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Application starting");
});