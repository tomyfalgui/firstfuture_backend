// IMPORTS
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
var cors = require('cors');
// Router Imports
var users = require('./routes/users');
var companies = require('./routes/companies')


var app = express();

// Global App Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());


// Routes
app.use('/api/users',users);
app.use('/api/companies',companies);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
	console.log("Application starting");
});
