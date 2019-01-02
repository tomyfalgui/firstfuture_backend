const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const { User, ExtraCurricular, Skill, Language, WorkExperience, ProfilePicture } = require('../database');
const passport = require('passport');
const {extractUserId, extractUserIdToBody} = require('../middleware/middlewareUser.js');

router.post('*', passport.authenticate('jwt', { session: false }));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('jwt', { session: false }));
router.delete('*', extractUserId);

router.post('/new/profilePicture', (req, res, next) => {
    ProfilePicture.count({where:{userId : req.userId}}).then((count)=>{
        console.log(count);
        if(count == 0){
            ProfilePicture.create({image:req.files.image.data, mimetype:req.files.image.mimetype, userId:req.userId}).then(() =>
            res.json(true));
        }
        else{
            ProfilePicture.update({image:req.files.image.data, mimetype:req.files.image.mimetype}, { where: {userId: req.userId }})
            .then(res.json(true));
        }
    })
});

router.post('/new/skill', (req, res) => {
    req.body.userId = req.userId;
    Skill.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/workExperience', (req, res) => {
    req.body.userId = req.userId;
    WorkExperience.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/language', (req, res) => {
    req.body.userId = req.userId;
    Language.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/extraCurricular', (req, res) => {
    req.body.userId = req.userId;
    ExtraCurricular.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/edit',  (req, res) => {
    User.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(user => res.json(user));
});

router.post('/edit/skill', (req, res) => {
    Skill.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(skill => res.json(skill));
});

router.post('/edit/profilePicture', (req, res) => {
    ProfilePicture.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(skill => res.json(skill));
});


router.post('/edit/workExperience', (req, res) => {
    WorkExperience.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(skill => res.json(skill));
});


router.post('/edit/extraCurricular', (req, res) => {
    ExtraCurricular.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(extracurricular => res.json(extracurricular));
});

router.post('/edit/language', (req, res) => {
    Language.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(language => res.json(language));
});

router.delete('/delete', (req, res) => {
    User.destroy({ where: { id: req.userId } })
        .then(res.json(true));
});

router.delete('/delete/skill', (req, res) => {
    Skill.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

router.delete('/delete/extraCurricular', (req, res) => {
    ExtraCurricular.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

router.delete('/delete/workExperience', (req, res) => {
    WorkExperience.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

router.delete('/delete/profilePicture', (req, res) => {
    ProfilePicture.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

router.delete('/delete/language', (req, res) => {
    Language.destroy({ where: { id: req.query.id, userId: req.userId } })
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