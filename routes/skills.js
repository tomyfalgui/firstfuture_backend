const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Skill} = require('../database');
const {userIdToBody} = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
  Skill.create(req.body)
      .then((skill) =>res.json(skill))
      .catch((err)=>res.jsone(err));
});

router.post('/edit', (req, res) => {
  Skill.update(req.body.deltas, {where: {id: req.body.id, userId: req.userId}})
      .then((skill) =>res.json(skill))
      .catch((err)=>res.jsone(err));
});

router.delete('/delete/:id', (req, res) => {
  Skill.destroy({where: {id: req.params.id, userId: req.userId}})
      .then((skill) =>res.json(skill))
      .catch((err)=>res.jsone(err));
});

module.exports = router;
