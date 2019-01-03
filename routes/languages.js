const express = require('express');
var router = express.Router();
const {Language} = require('../database');
const {userIdToBody} = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
    Language.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/edit', (req, res) => {
    Language.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(language => res.json(language));
});

router.delete('/delete', (req, res) => {
    Language.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

module.exports = router;