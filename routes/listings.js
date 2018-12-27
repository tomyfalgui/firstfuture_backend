const express = require('express');
const { JobListing } = require('../database');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const passport = require('passport');
const passportJWT = require("passport-jwt");
const middleware = require('../middleware/middlewareCompany.js');
require('../passport.js');


router.post('/new', [passport.authenticate('company-jwt', {session: false}), middleware.extractCompanyIdBody], (req, res) => {
    JobListing.create(req.body)
        .then(listing => res.json(listing))
        .catch(err => res.json(err));
});

router.get('/show/:id', (req, res) => {
    JobListing.findOne({
        where: {
            id: req.params.id
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
                { street: { [Op.like]: `%${q}%` } },
                { barangay: { [Op.like]: `%${q}%` } },
                { city: { [Op.like]: `%${q}%` } },
                { province: { [Op.like]: `%${q}%` } }
            ]
        }
    })
    .then(listing => res.json(listing))
    .catch(err => res.json(err));
})

router.post('/edit', [passport.authenticate('company-jwt', {session: false}), middleware.extractCompanyIdBody],  (req, res) => {
    JobListing.update(
        req.body.deltas, {where: { id: req.body.id, companyId : req.body.companyId }}
    )
    .then(listing => res.json(listing))
    .catch(err => res.json(err));
})

router.delete('/delete', [passport.authenticate('company-jwt', {session: false}), middleware.extractCompanyIdQuery], (req, res) => {
    JobListing.destroy({ 
        where: {
            id : req.query.id,
            companyId: req.query.companyId
        }
    })
    .then(listing => res.json('listing deleted'))
    .catch(err => res.json(err));
});

module.exports = router;