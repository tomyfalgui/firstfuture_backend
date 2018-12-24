const express = require('express');
const { JobListing } = require('../database');
var router = express.Router();

router.post('/new', (req, res) => {
    JobListing.create(req.body)
        .then(listing => res.json(listing));
});

router.delete('/delete/:id', (req, res) => {
    JobListing.destroy({ where: {id : req.params.companyId}} )
        .then(res.json(true));
});

module.exports = router;