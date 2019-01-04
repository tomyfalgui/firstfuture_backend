const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {WorkExperience} = require('../database');
const {userIdToBody} = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
  WorkExperience.create(req.body)
      .then((workExperiences) => res.json(workExperiences))
      .catch((err) => res.json(err));
});

router.post('/edit', (req, res) => {
  WorkExperience.update(req.body.deltas, {
    where: {
      id: req.body.id,
      userId: req.userId}})
      .then((workExperiences) => res.json(workExperiences))
      .catch((err) => res.json(err));
});

router.delete('/delete', (req, res) => {
  WorkExperience.destroy({where: {id: req.query.id, userId: req.userId}})
      .then((workExperiences) => res.json(workExperiences))
      .catch((err) => res.json(err));
});

module.exports = router;
