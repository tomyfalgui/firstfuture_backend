const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const { User, ExtraCurricular, Skill, Language, WorkExperience, ProfilePicture } = require('../database');
const passport = require('passport');
const middleware = require('../middleware/middlewareUser.js');
const fs = require('fs');

router.post('/new/profilePicture', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res, next) => {
    ProfilePicture.count({where:{userId : req.body.userId}}).then((count)=>{
        console.log(count);
        if(count == 0){
            ProfilePicture.create({image:req.files.image.data, mimetype:req.files.image.mimetype, userId:req.body.userId}).then(() =>
            res.json(true));
        }
        else{
            ProfilePicture.update({image:req.files.image.data, mimetype:req.files.image.mimetype}, { where: {userId: req.body.userId }})
            .then(res.json(true));
        }
    })
});

router.post('/new/skill', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    Skill.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/workExperience', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    WorkExperience.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/language',[passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    Language.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/extraCurricular', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    ExtraCurricular.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/edit', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    User.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(user => res.json(user));
});

router.post('/edit/skill', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    Skill.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(skill => res.json(skill));
});

router.post('/edit/profilePicture', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    ProfilePicture.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(skill => res.json(skill));
});


router.post('/edit/workExperience', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    WorkExperience.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(skill => res.json(skill));
});


router.post('/edit/extraCurricular', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    ExtraCurricular.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(extracurricular => res.json(extracurricular));
});

router.post('/edit/language', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdBody], (req, res) => {
    Language.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(language => res.json(language));
});

router.delete('/delete', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdQuery], (req, res) => {
    User.destroy({ where: { id: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/skill', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdQuery], (req, res) => {
    Skill.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/extraCurricular', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdQuery], (req, res) => {
    ExtraCurricular.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/workExperience', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdQuery], (req, res) => {
    WorkExperience.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/profilePicture', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdQuery], (req, res) => {
    ProfilePicture.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/language', [passport.authenticate('jwt', { session: false }), middleware.extractUserIdQuery], (req, res) => {
    Language.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});


router.get('/show/profilePicture/:id',(req,res,next)=>{
    ProfilePicture.findOne({
        where: {
            userId: req.params.id       
        }
    }).then((result)=>{
        res.set('Content-Type', result.mimetype);
        res.send(result.image);
    })
});

router.get('/show/:id',(req,res,next)=>{
    User.findOne({where:{id:req.params.id}}).then((user)=>{
        delete user.password;
        delete user.salt;
        Skill.findAll({where:{userId:req.params.id}}).then((skills)=>{
            WorkExperience.findAll({where:{userId:req.params.id}}).then((workexperiences)=>{
                Language.findAll({where:{userId:req.params.id}}).then((languages)=>{
                    ExtraCurricular.findAll({where:{userId:req.params.id}}).then((excurr)=>{
                        res.json(
                            {
                                "user":user,
                                "skills":skills,
                                "workExperiences":workexperiences,
                                "languages":languages,
                                "extraCurriculars":excurr
                            }
                        )
                    })
                })  
            })
        })
    })
});

module.exports = router;