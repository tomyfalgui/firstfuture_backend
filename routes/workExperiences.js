const express = require('express');
var router = express.Router();
const {WorkExperience} = require('../database');
const {userIdToBody} = require('../middleware/middlewareUser');

router.post('/new', userIdToBody, (req, res) => {
    WorkExperience.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/edit', (req, res) => {
    WorkExperience.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(workExperiences => res.json(workExperiences));
});

router.delete('/delete',  (req, res) => {
    WorkExperience.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

module.exports = router;