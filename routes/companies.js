const express = require('express');
const {Company} = require('../database');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/edit', (req, res) => {
    Company.update(req.body.deltas,{ where: { id : req.body.id }} )
        .then(company => res.json(company));
})

router.delete('/delete/', (req,res) => {
    Company.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

module.exports = router;