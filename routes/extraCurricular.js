const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {ExtraCurricular} = require('../database');
const {userIdToBody} = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
  ExtraCurricular.create(req.body)
      .then((extracurricular) => res.json(extracurricular))
      .catch((err) => res.json(err));
});

router.post('/edit', (req, res) => {
  ExtraCurricular.update(req.body.deltas, {
    where: {
      id: req.body.id,
      userId: req.userId}})
      .then((extracurricular) => res.json(extracurricular))
      .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
  ExtraCurricular.destroy({
    where: {
      id: req.params.id,
      userId: req.userId}})
      .then((extracurricular) => res.json(extracurricular))
      .catch((err) => res.json(err));
});

module.exports = router;
