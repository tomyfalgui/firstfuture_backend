const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const dotenv = require('dotenv').config({path:'../.env'});
const bcrypt = require('bcrypt');
const {User,ExtraCurricular,Skill,Language,WorkExperience,Company} = require('../database');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/login/user',  (req, res) => {
    login('local',req,res);
});

router.post('/login/company',  (req, res) => {
    login('company-local',req,res);
});

router.post('/signup/user', (req, res) => {
    let plaintext = req.body.user.password;
    req.body.user.password = encryptPassword(plaintext);
    User.create(req.body.user).then((user)=>{
        let id = user.id;
        
        var promisesSkill = [];
        var promisesExtraCurricular = [];
        var promisesWorkExperience = [];
        var promisesLanguage = []; 
        var out = {};

        for(let skill of req.body.skills){
            skill.userId = id;
            promisesSkill.push(Skill.create(skill));
        }
        for(let extracurricular of req.body.extracurriculars){
            extracurricular.userId = id;
            promisesExtraCurricular.push(ExtraCurricular.create(extracurricular));
        }
        for(let workExperience of req.body.workExperiences){
            workExperience.userId = id;
            promisesWorkExperience.push(WorkExperience.create(workExperience));
        }
        for(let language of req.body.languages){
            language.userId = id;
            promisesLanguage.push(Language.create(language));
        }
        
        out.user = user;
        
        Promise.all([
            Promise.all(promisesSkill).then((results)=>{
                out.skills = results;
            }),
            Promise.all(promisesExtraCurricular).then((results)=>{
                out.extraCurriculars = results
            }),
            Promise.all(promisesWorkExperience).then((results)=>{
                out.workExperiences = results
            }),
            Promise.all(promisesLanguage).then((results)=>{
                out.languages = results
            })
        ])
        .then((output)=>{
            res.json(out)
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

router.post('/signup/company', (req, res) => {
    req.body.password = encryptPassword(req.body.password);
    Company.create(req.body)
        .then(company => res.json(company))
        .catch((err) => res.json(err));
});


function encryptPassword(plaintext){
    let salt = bcrypt.genSaltSync(saltRounds);
    let password = bcrypt.hashSync(plaintext, salt);
    return(password);
}

function login(strategy,req,res){
    passport.authenticate(strategy, {session: false}, (err, user, info) => {
        if (err || !user) {
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
}

module.exports = router;