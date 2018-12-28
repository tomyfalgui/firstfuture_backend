const express = require('express');
const {Company,JobListing} = require('../database');
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

router.get('/show/:id',(req,res,next)=>{
    Company.findOne({id:req.params.id}).then((company)=>{
        delete company.password;
        delete company.salt;
        res.json(company);
    })
});

router.get('/show-all/:id',(req,res,next)=>{
    Company.findOne({where:{id:req.params.id}}).then((company)=>{
        delete company.password;
        delete company.salt;
        JobListing.findAll({where:{id:req.params.id}}).then((listings)=>{
            res.json({
                "company":company,
                "listings":listings
            });
        })
    })
});

module.exports = router;