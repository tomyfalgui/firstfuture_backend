const express = require('express');
const { JobListing } = require('../database');
var router = express.Router();

router.post('/new', (req, res) => {
    JobListing.create(req.body)
        .then(listing => res.json(listing));
});

router.get('/show/:id', (req, res) => {
    const { id } = req.params;
    JobListing.findOne({
        where: {
            id: id
        }
    }).then(listing => res.json(listing))
});

router.get('/search', (req, res) => { // under construction
    JobListing.findAll().then(listing => res.json(listing));
})

// will try to improve this to partial edit
router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    JobListing.update(
        req.body, 
        {
            where: { id: id }
        }
    ).then(listing => res.json(listing));
})

router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    JobListing.destroy({ 
        where: {
            id : id
        }
    }).then(listing => res.json('listing deleted'))
});

module.exports = router;