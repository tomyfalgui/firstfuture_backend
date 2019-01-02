const express = require('express');
const { Application } = require('../database');
var router = express.Router();
const {extractUserId} = require('../middleware/middlewareUser.js');

router.use(extractUserId);

//create new application
router.post('/new', (req, res) => {
    req.body.userId = req.userId;
    Application.create(req.body)
        .then(application => res.json(application));
});

//find by id 
router.get('/show/:id', (req, res) => {
    Application.findOne({
        where: {
            id: req.params.id,
            userId: req.userId
        }
    }).then(function(application) {
        res.json(application);
    });
});

//update application
router.post('/edit', (req, res) => {
    Application.update(
        req.body.deltas, {
            where: { id: req.body.id, userId: req.userId }
        }
    ).then(application => res.json(application));
})

//delete application
router.delete('/delete/:id', (req, res) => {
    Application.destroy({
        where: {
            id: req.query.id,
            userId: req.userId
        }
    }).then(function(application) {
        res.json(application);
    });
});

module.exports = router;