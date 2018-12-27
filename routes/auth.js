const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const {User,ExtraCurricular,Skill,Language,WorkExperience,Company} = require('../database');

const saltRounds = 10;

router.post('/login/user',  (req, res) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            if(err){
                console.log(err)
            }
            if(!user){
                console.log('No user')
            }
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           const token = jwt.sign(user, process.env.JWTSecret);
           return res.json({user, token});
        });
    })(req, res);
});

router.post('/signup/user', (req, res) => {
    let plaintext = req.body.user.password;
    req.body.user.salt = bcrypt.genSaltSync(saltRounds);
    req.body.user.password = bcrypt.hashSync(plaintext,req.body.user.salt);
    User.create(req.body.user).then((user)=>{
        let id = user.id;
        for(let skill of req.body.skills){
            skill.userId = id;
            Skill.create(skill);
        }
        for(let extracurricular of req.body.extracurriculars){
            extracurricular.userId = id;
            ExtraCurricular.create(extracurricular);
        }
        for(let workExperience of req.body.workExperiences){
            workExperience.userId = id;
            WorkExperience.create(workExperience)
        }
        for(let language of req.body.languages){
            language.userId = id;
            Language.create(language);
        }
    })
    .then(() => res.json(true))
});

router.post('/signup/company', (req, res) => {
    let plaintext = req.body.password;
    req.body.salt = bcrypt.genSaltSync(saltRounds);
    req.body.password = bcrypt.hashSync(plaintext,req.body.salt);
    Company.create(req.body)
        .then(company => res.json(company));
});

router.post('/login/company',  (req, res) => {
    passport.authenticate('company-local', {session: false}, (err, user, info) => {
        if (err || !user) {
            if(err){
                console.log(err)
            }
            if(!user){
                console.log('No user')
            }
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           const token = jwt.sign(user, process.env.JWTSecret);
           return res.json({user, token});
        });
    })(req, res);
});

module.exports = router;