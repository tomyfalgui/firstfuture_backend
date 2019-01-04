const express = require('express');
const { Application } = require('../database');
var router = express.Router();
const { extractUserId, userIdToBody } = require('../middleware/id.js');

router.use(extractUserId);

router.post('/new', userIdToBody, (req, res) => {
    Application.create(req.body)
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res) => {
    Application.findOne({
        where: {
            id: req.params.id,
            userId: req.userId
    }})
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});


router.post('/edit', (req, res) => {
    Application.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
})

router.delete('/delete/:id', (req, res) => {
    Application.destroy({
        where: {
            id: req.query.id,
            userId: req.userId
        }
    })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});

module.exports = router;