const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Company, JobListing} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const passport = require('passport');
const _ = require('lodash');

router.post('*', passport.authenticate('company-jwt', { session: false }));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('company-jwt', { session: false }));
router.delete('*', extractUserId);
router.get('*', passport.authenticate(['jwt','company-jwt'], {session: false}));

router.post('/edit', (req, res) => {
  Company.update(req.body.deltas, {
    where: {
      id: req.userId,
    }})
      .then((company) => res.json(company))
      .catch((err) => res.json(err));
});

router.delete('/delete/', (req, res) => {
  Company.destroy({
    where: {
      id: req.companyId},
  })
      .then((company) => res.json(company))
      .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res, next) => {
  Company.findOne({id: req.params.id})
      .then((company) => {
        res.json(_.omit(company,['password']));
      })
      .catch((err) => res.json(err));
});

router.get('/show/:id/listings', (req, res, next) => {
  Company.findOne({where: {id: req.params.id}})
      .then((company) => {
        delete company.password;
        JobListing.findAll({where: {id: req.params.id}})
            .then((listings) => {
              res.json({
                'company': _.omit(company,['password']),
                'listings': listings,
              });
            })
            .catch((err) => res.json(err));
      });
});

module.exports = router;
