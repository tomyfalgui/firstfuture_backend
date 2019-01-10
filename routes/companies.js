const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Company, JobListing} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const {userOnly, companyOnly} = require('../middleware/auth');

router.post('*', [companyOnly, extractUserId]);
router.delete('*', [companyOnly, extractUserId]);
router.get('*', userOnly);

router.post('/edit', (req, res) => {
  Company.update(req.body.deltas, {
    where: {
      id: req.userId,
    },
    fields: ['userName', 'email',
      'companyName', 'contactNumber', 'desciption', 'city'],
  })
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
        res.json(company);
      })
      .catch((err) => res.json(err));
});

router.get('/show/:id/listings', (req, res, next) => {
  Company.findOne({where: {id: req.params.id}, include: [JobListing]})
      .then((company) => {
        res.json({
          'company': company,
          'listings': listings});
      }).catch((err) => res.json(err));
});

module.exports = router;
