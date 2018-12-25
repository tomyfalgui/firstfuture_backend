const express = require('express');
const { Application } = require('../database');
var router = express.Router();

//create new application
router.post('/new', (req, res) => {
    Application.create(req.body)
        .then(application => res.json(application));
});

//find by id 
router.get('/show/:id', (req, res) => {
    const { id } = req.params;
    Application.findOne({
        where: {
            id: id
        }
    }).then(function(application) {
        res.json(application);
    })
});

//update application
router.put('edit/:id', (req, res) => {
    const { id } = req.params;
    Application.update(
        req.body, {
            where: { id: id }
        }
    ).then(application => res.json(application));
})

//delete application
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    Application.destroy({
        where: {
            id: id
        }
    }).then(function(application) {
        res.json(application);
    })
});

module.exports = router;