const express = require('express');
const {Company,JobListing} = require('../database');
var router = express.Router();
const bcrypt = require('bcrypt');
const {extractUserId} = require('../middleware/middlewareUser.js');
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const passport = require('passport');

router.post('/edit', [passport.authenticate('company-jwt', {session: false}), extractUserId], (req, res) => {
    Company.update(req.body.deltas,{ where: { id : req.companyId }} )
        .then(company => res.json(company));
})

router.delete('/delete', [passport.authenticate('company-jwt', {session: false}), extractUserId], (req,res) => {
    Company.destroy({ where: {id : req.companyId}} )
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
        JobListing.findAll({where:{id:req.params.id}}).then((listings)=>{
            res.json({
                "company":company,
                "listings":listings
            });
        })
    })
});

module.exports = router;