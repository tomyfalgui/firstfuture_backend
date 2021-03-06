const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Language} = require('../database');
const {userIdToBody} = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
  Language.create(req.body)
      .then((language) => res.json(language))
      .catch((err) => res.json(err));
});

router.post('/edit', (req, res) => {
  Language.update(req.body.deltas, {
    where: {
      id: req.body.id,
      userId: req.userId}})
      .then((language) => res.json(language))
      .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
  Language.destroy({
    where: {
      id: req.params.id,
      userId: req.userId}})
      .then((language) => res.json(language))
      .catch((err) => res.json(err));
});

module.exports = router;
