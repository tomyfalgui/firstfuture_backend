const express = require('express');
const { JobListing } = require('../database');
var router = express.Router();

router.post('/new', (req, res) => {
    JobListing.create(req.body)
        .then(listing => res.json(listing));
});

router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    JobListing.destroy({ 
        where: {
            id : id
        }
    }).then(function(listing) {
        res.json('listing deleted');
    })
});

module.exports = router;