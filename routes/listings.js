const express = require('express');
const { JobListing } = require('../database');
var router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('/new', (req, res) => {
    JobListing.create(req.body)
        .then(listing => res.json(listing))
        .catch(err => res.json(err));
});

router.get('/show/:id', (req, res) => {
    const { id } = req.params;
    JobListing.findOne({
        where: {
            id: id
        }
    })
    .then(listing => res.json(listing))
    .catch(err => res.json(err));
});

router.get('/search', (req, res) => { 
    let { q } = req.query;
    
    JobListing.findAll({
        where: {
            [Op.or]: [
                { position: { [Op.like]: `%${q}%` } },
                { description: { [Op.like]: `%${q}%` } },
                { street: { [Op.like]: `%${q}%` } },
                { barangay: { [Op.like]: `%${q}%` } },
                { city: { [Op.like]: `%${q}%` } },
                { province: { [Op.like]: `%${q}%` } },
                { strands: { [Op.like]: `%${q}%`.toString() } }
            ]
        }
    })
    .then(listing => res.json(listing))
    .catch(err => res.json(err));
})

router.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    JobListing.update(
        req.body, 
        {
            where: { id: id }
        }
    )
    .then(listing => res.json(listing))
    .catch(err => res.json(err));
})

router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    JobListing.destroy({ 
        where: {
            id : id
        }
    })
    .then(listing => res.json('listing deleted'))
    .catch(err => res.json(err));
});

module.exports = router;