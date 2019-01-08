const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const { Application } = require('../database');
const { extractUserId } = require('../middleware/id.js');

router.use(extractUserId);

router.post('/new', (req, res) => {
    Application.create({
            userId: req.userId,
            jobListingId: req.body.jobListingId
        })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res) => {
    Application.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});


router.post('/edit', (req, res) => {
    delete req.body.deltas.status;
    Application.update(req.body.deltas, {
            where: {
                id: req.body.id,
                userId: req.userId
            }
        })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
    Application.destroy({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});

router.get('/show-status/:status', (req, res) => {
    Application.findAll({
            where: {
                status: req.params.status
            }
        })
        .then((application) => res.json(application))
        .catch((err) => res.json(err));
});


module.exports = router;