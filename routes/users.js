const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
require('dotenv').config();
// eslint-disable-next-line max-len
const {User, ExtraCurricular, Skill, Language, WorkExperience} = require('../database');
const passport = require('passport');
const {extractUserId} = require('../middleware/id.js');

router.post('*', passport.authenticate('jwt', {session: false}));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('jwt', {session: false}));
router.delete('*', extractUserId);

router.post('/edit', (req, res) => {
  delete req.body.user.verified;
  User.update(req.body.deltas, {
    where: {
      id: req.userId}})
      .then((user) => {
        delete user.password;
        res.json(user);
      })
      .catch((err)=> res.json(err));
});

router.delete('/delete', (req, res) => {
  User.destroy({
    where: {
      id: req.userId}})
      .then((user) => res.json(user))
      .catch((err)=> res.json(err));
});

router.get('/show/:id', (req, res, next)=>{
  User.findOne({where: {id: req.params.id}})
      .then((user)=>{
        delete user.password;

        const results = {};
        Promise.all([
          Skill.findAll({where: {userId: user.id}}).then((out)=>{
            results.skills = out;
          }),
          WorkExperience.findAll({where: {userId: user.id}}).then((out)=>{
            results.workExperiences = out;
          }),
          ExtraCurricular.findAll({where: {userId: user.id}}).then((out)=>{
            results.extraCurriculars = out;
          }),
          Language.findAll({where: {userId: user.id}}).then((out)=>{
            results.languages = out;
          }),
        ])
            .then(()=> res.json(out))
            .catch((err)=>res.json(err));
      })
      .catch((err)=>res.json(err));
});

module.exports = router;
