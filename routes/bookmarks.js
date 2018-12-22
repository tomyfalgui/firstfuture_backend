const express = require('express');
const {Bookmark} = require('../database');
var router = express.Router();

router.post('/new', (req, res) => {
    Bookmark.create(req.body)
        .then(bookmark => res.json(bookmark));
});

router.delete('/delete', (req,res) => {
    Bookmark.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

module.exports = router;