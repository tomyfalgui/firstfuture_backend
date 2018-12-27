const express = require('express');
const {Bookmark} = require('../database');
var router = express.Router();
const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const middleware = require('../middleware/middlewareUser.js');

router.post('/new', middleware.extractUserIdBody, (req, res) => {
    Bookmark.create(req.body)
        .then(bookmark => res.json(bookmark));
});

router.delete('/delete', middleware.extractUserIdQuery, (req,res) => {
    Bookmark.destroy({ where: {id : req.query.id, userId : req.query.userId}} )
        .then(res.json(true));
});

module.exports = router;