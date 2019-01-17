// IMPORTS
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {extractUserId} = require('./middleware/id');
const {userOnly, studentOnly} = require('./middleware/auth');
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
const extraCurr = require('./routes/extraCurriculars');
const languages = require('./routes/languages');
const workExp = require('./routes/workExperiences');
const profilePicture = require('./routes/profilePicture');
const companyPicture = require('./routes/companyPicture');
const location = require('./routes/locations');

const app = express();

// Global App Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw({inflate: true, limit: '150kb'}));
app.use(fileUpload());
app.use(cors());


// Routes

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/companies', companies);
app.use('/api/bookmarks', [studentOnly, extractUserId], bookmarks);
app.use('/api/applications', extractUserId, applications);
app.use('/api/listings', listings);
app.use('/api/feed/user', [studentOnly, extractUserId], feedUser);
app.use('/api/skills', [studentOnly, extractUserId], skills);
app.use('/api/extracurriculars', [studentOnly, extractUserId], extraCurr);
app.use('/api/languages', [studentOnly, extractUserId], languages);
app.use('/api/workexperiences', [studentOnly, extractUserId], workExp);
app.use('/api/profilepicture', profilePicture);
app.use('/api/companypicture', companyPicture);
app.use('/api/locations', location);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Application starting');
});

module.exports = app;
