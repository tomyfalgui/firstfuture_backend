const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const {User,ExtraCurricular,Skill,Language,WorkExperience,ProfilePicture} = require('../database');
const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/new', (req, res) => {
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

router.post('/new/profilePicture', (req, res) => {
    ProfilePicture.create(req.body).then(()=>
        res.json(true)
    );
});

router.post('/new/skill', (req, res) => {
    Skill.create(req.body).then(()=>
        res.json(true)
    );
});

router.post('/new/workExperience', (req, res) => {
    WorkExperience.create(req.body).then(()=>
        res.json(true)
    );
});

router.post('/new/language', (req, res) => {
    Language.create(req.body).then(()=>
        res.json(true)
    );
});

router.post('/new/extraCurricular', (req, res) => {
    ExtraCurricular.create(req.body).then(()=>
        res.json(true)
    );
});

router.post('/edit', (req, res) => {
    User.update(req.body.deltas,{ where: { id : req.body.id }} )
        .then(user => res.json(user));
});

router.post('/edit/skill', (req, res) => {
    Skill.update(req.body.deltas,{ where: {id : req.body.id}} )
        .then(skill => res.json(skill));
});

router.post('/edit/profilePicture', (req, res) => {
    ProfilePicture.update(req.body.deltas,{ where: {id : req.body.id}} )
        .then(skill => res.json(skill));
});

router.post('/edit/extraCurricular', (req, res) => {
    ExtraCurricular.update(req.body.deltas,{ where: {id : req.body.id}} )
        .then(extracurricular => res.json(extracurricular));
});

router.post('/edit/language', (req, res) => {
    Language.update(req.body.deltas,{ where: {id : req.body.id}} )
        .then(language => res.json(language));
});

router.delete('/delete', (req,res) => {
    User.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

router.delete('/delete/skill', (req,res) => {
    Skill.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

router.delete('/delete/extraCurricular', (req,res) => {
    ExtraCurricular.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

router.delete('/delete/language', (req,res) => {
    Language.destroy({ where: {id : req.query.id}} )
        .then(res.json(true));
});

module.exports = router;