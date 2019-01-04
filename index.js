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
const {extractUserId} = require('./middleware/id');
const helmet = require('helmet')
require('./passport.js');

// Router Imports
var users = require('./routes/users');
var companies = require('./routes/companies');
var bookmarks = require('./routes/bookmarks');
var applications = require('./routes/applications');
var listings = require('./routes/listings');
var auth = require('./routes/auth');
var feedUser = require('./routes/feedUser');
var skills = require('./routes/skills');
var extraCurriculars = require('./routes/extraCurricular');
var languages = require('./routes/languages');
var workExperiences = require('./routes/workExperiences');
var profilePicture = require('./routes/profilePicture');

var app = express();

// Global App Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.raw({ inflate: true, limit: '100kb'}));
app.use(fileUpload());
app.use(cors());

// Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/companies', passport.authenticate('company-jwt', { session: false }), companies);
app.use('/api/bookmarks', passport.authenticate('jwt', { session: false }), bookmarks);
app.use('/api/applications', passport.authenticate('jwt', { session: false }), applications);
app.use('/api/listings', listings);
app.use('/api/feed/user',  [passport.authenticate('jwt', { session: false }), extractUserId], feedUser);
app.use('/api/skills', [passport.authenticate('jwt', { session: false }), extractUserId], skills);
app.use('/api/extracurriculars', [passport.authenticate('jwt', { session: false }), extractUserId], extraCurriculars);
app.use('/api/languages', [passport.authenticate('jwt', { session: false }), extractUserId], languages);
app.use('/api/workexperiences', [passport.authenticate('jwt', { session: false }), extractUserId], workExperiences);
app.use('/api/profilepicture', profilePicture);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Application starting");
});

module.exports = app