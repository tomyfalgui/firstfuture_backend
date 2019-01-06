// IMPORTS
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const {extractUserId} = require('./middleware/id');
const helmet = require('helmet');
require('./passport.js');

// Router Imports
const users = require('./routes/users');
const companies = require('./routes/companies');
const bookmarks = require('./routes/bookmarks');
const applications = require('./routes/applications');
const listings = require('./routes/listings');
const auth = require('./routes/auth');
const feedUser = require('./routes/feedUser');
const skills = require('./routes/skills');
const extraCurr = require('./routes/extraCurricular');
const languages = require('./routes/languages');
const workExp = require('./routes/workExperiences');
const profilePicture = require('./routes/profilePicture');
const companyPicture = require('./routes/companyPicture');

const app = express();

// Global App Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw({inflate: true, limit: '150kb'}));
app.use(fileUpload());
app.use(cors());

// Routes
const protectedUser = passport.authenticate('jwt', {session: false});

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/companies', companies);
app.use('/api/bookmarks', protectedUser, bookmarks);
app.use('/api/applications', protectedUser, applications);
app.use('/api/listings', listings);
app.use('/api/feed/user', [protectedUser, extractUserId], feedUser);
app.use('/api/skills', [protectedUser, extractUserId], skills);
app.use('/api/extracurriculars', [protectedUser, extractUserId], extraCurr);
app.use('/api/languages', [protectedUser, extractUserId], languages);
app.use('/api/workexperiences', [protectedUser, extractUserId], workExp);
app.use('/api/profilepicture', profilePicture);
app.use('/api/companypicture', companyPicture);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Application starting');
});

module.exports = app;
