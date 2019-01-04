const express = require('express');
const { JobListing } = require('../database');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const passport = require('passport');
const passportJWT = require("passport-jwt");
const {extractUserId,userIdToBody} = require('../middleware/id.js');
require('../passport.js');

router.post('*', passport.authenticate('company-jwt', {session: false}));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('company-jwt', {session: false}));
router.delete('*', extractUserId);

router.post('/new', userIdToBody, (req, res) => {
    JobListing.create(req.body)
        .then((listing) => res.json(listing))
        .catch((err) => res.json(err));
});

router.post('/edit',  (req, res) => {
    JobListing.update(req.body.deltas, {where: { id: req.body.id, companyId : req.companyId }})
        .then((listing) => res.json(listing))
        .catch((err) => res.json(err));
})

router.delete('/delete',  (req, res) => {
    JobListing.destroy({ 
        where: {
            id : req.query.id,
            companyId: req.companyId
        }
    })
        .then((listing) => res.json(listing))
        .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res) => {
    JobListing.findOne({where: {id: req.query.id}})
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
});

module.exports = router;