const express = require('express');
var router = express.Router();
const { Skill } = require('../database');
const { userIdToBody } = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
    Skill.create(req.body).then(() =>
        res.json(skill)
    );
});

router.post('/edit', (req, res) => {
    Skill.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(skill => res.json(skill));
});

router.delete('/delete', (req, res) => {
    Skill.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(skill));
});

module.exports = router;