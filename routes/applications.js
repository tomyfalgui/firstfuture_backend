const express = require('express');
const { Application } = require('../database');
var router = express.Router();

router.post('/new', (req, res) => {
    Application.create(req.body)
        .then(application => res.json(application));
});

router.get('/show/:id', (req, res) => {
    const { id } = req.params;
    Application.findOne({
        where: {
            id: id
        }
    }).then(function(application) {
        res.json(application);
    })
});

module.exports = router;