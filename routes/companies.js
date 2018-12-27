const express = require('express');
const {Company} = require('../database');
var router = express.Router();
const bcrypt = require('bcrypt');
const middleware = require('../middleware/middlewareCompany.js');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const passport = require('passport');

router.post('/edit', [passport.authenticate('company-jwt', {session: false}), middleware.extractCompanyIdBody], (req, res) => {
    Company.update(req.body.deltas,{ where: { id : req.body.companyId }} )
        .then(company => res.json(company));
})

router.delete('/delete', [passport.authenticate('company-jwt', {session: false}), middleware.extractCompanyIdQuery], (req,res) => {
    Company.destroy({ where: {id : req.query.companyId}} )
        .then(res.json(true));
});

module.exports = router;