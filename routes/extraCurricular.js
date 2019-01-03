const express = require('express');
var router = express.Router();
const {ExtraCurricular} = require('../database');
const {userIdToBody} = require('../middleware/id');

router.post('/new', userIdToBody, (req, res) => {
    ExtraCurricular.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/edit', (req, res) => {
    ExtraCurricular.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(extracurricular => res.json(extracurricular));
});

router.delete('/delete', (req, res) => {
    ExtraCurricular.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

module.exports = router;