const express = require('express');
const {Bookmark} = require('../database');
var router = express.Router();

const passport = require('passport');
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;

router.post('/new', (req, res) => {
    console.log(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
    Bookmark.create(req.body)
        .then(bookmark => res.json(bookmark));
});

router.delete('/delete', (req,res) => {
    Bookmark.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

module.exports = router;