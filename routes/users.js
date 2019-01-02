const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const {User, ExtraCurricular, Skill, Language, WorkExperience} = require('../database');
const passport = require('passport');
const {extractUserId} = require('../middleware/middlewareUser.js');

router.post('*', passport.authenticate('jwt', { session: false }));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('jwt', { session: false }));
router.delete('*', extractUserId);

router.post('/edit',  (req, res) => {
    User.update(req.body.deltas, { where: { id: req.body.id, userId: req.userId } })
        .then(user => res.json(user));
});

router.delete('/delete', (req, res) => {
    User.destroy({ where: { id: req.userId } })
        .then(res.json(true));
});

router.get('/show/:id',(req,res,next)=>{
    User.findOne({where:{id:req.params.id}}).then((user)=>{
        delete user.password;
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