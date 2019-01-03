const express = require('express');
const { Bookmark } = require('../database');
var router = express.Router();
const passport = require('passport');
const passportJWT = require("passport-jwt");
const { extractUserId } = require('../middleware/id.js');

router.use(extractUserId);

router.post('/new', (req, res) => {
    req.body.userId = req.userId;
    Bookmark.create(req.body)
        .then(bookmark => res.json(bookmark));
});

router.delete('/delete/:id', (req, res) => {
    Bookmark.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(bookmark));
});

module.exports = router;