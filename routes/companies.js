const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Company, JobListing} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const passport = require('passport');

const protected = passport.authenticate('company-jwt', {session: false});

router.post('/edit', [protected, extractUserId], (req, res) => {
  Company.update(req.body.deltas, {
    where: {
      id: req.userId,
    }})
      .then((company) => res.json(company))
      .catch((err) => res.json(err));
});

router.delete('/delete/', [protected, extractUserId], (req, res) => {
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
        delete company.password;
        res.json(company);
      })
      .catch((err) => res.json(err));
});

router.get('/show-all/:id', (req, res, next) => {
  Company.findOne({where: {id: req.params.id}})
      .then((company) => {
        delete company.password;
        JobListing.findAll({where: {id: req.params.id}})
            .then((listings) => {
              res.json({
                'company': company,
                'listings': listings,
              });
            })
            .catch((err) => res.json(err));
      });
});

module.exports = router;
