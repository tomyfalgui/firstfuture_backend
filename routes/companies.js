const express = require('express');
const {Company} = require('../database');
var router = express.Router();
const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/new', (req, res) => {
    let plaintext = req.body.password;
    req.body.salt = bcrypt.genSaltSync(saltRounds);
    req.body.password = bcrypt.hashSync(plaintext,req.body.salt);
    Company.create(req.body)
        .then(company => res.json(company));
});

router.post('/edit', (req, res) => {
    Company.update(req.body.deltas,{ where: { id : req.body.id }} )
        .then(company => res.json(company));
})

module.exports = router;