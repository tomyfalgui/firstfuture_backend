const express = require('express');
const { Application } = require('../database');
var router = express.Router();
const middleware = require('../middleware/middlewareUser.js');

//create new application
router.post('/new', middleware.extractUserIdBody, (req, res) => {
    Application.create(req.body)
        .then(application => res.json(application));
});

//find by id 
router.get('/show/:id', middleware.extractUserIdParams, (req, res) => {
    Application.findOne({
        where: {
            id: req.params.id,
            userId: req.params.userId
        }
    }).then(function(application) {
        res.json(application);
    })
});

//update application
router.post('/edit/:id', middleware.extractUserIdBody, (req, res) => {
    Application.update(
        req.body.deltas, {
            where: { id: req.body.id, userId: req.body.userId }
        }
    ).then(application => res.json(application));
})

//delete application
router.delete('/delete/:id', middleware.extractUserIdQuery, (req, res) => {
    Application.destroy({
        where: {
            id: req.query.id,
            userId: req.query.userId
        }
    }).then(function(application) {
        res.json(application);
    })
});

module.exports = router;