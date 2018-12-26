const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const {User,ExtraCurricular,Skill,Language,WorkExperience,ProfilePicture} = require('../database');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

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