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

router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    Application.destroy({
        where: {
            id: id
        }
    }).then(function(application) {
        res.json('deleted record');
    })
});


module.exports = router;