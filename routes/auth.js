const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config({path: '../.env'});
const bcrypt = require('bcrypt');
// eslint-disable-next-line max-len
const {User, ExtraCurricular, Skill, Language, WorkExperience, Company} = require('../database');

const saltRounds = parseInt(process.env.SALT_ROUNDS);

router.post('/login/user', (req, res) => {
  login('local', req, res);
});

router.post('/login/company', (req, res) => {
  login('company-local', req, res);
});

router.post('/signup/user', (req, res) => {
  const plaintext = req.body.user.password;
  req.body.user.password = encryptPassword(plaintext);
  User.create(req.body.user).then((user)=>{
    const id = user.id;

    const promisesSkill = [];
    const promisesExtraCurricular = [];
    const promisesWorkExperience = [];
    const promisesLanguage = [];
    const out = {};

    for (const skill of req.body.skills) {
      skill.userId = id;
      promisesSkill.push(Skill.create(skill));
    }
    for (const extracurricular of req.body.extracurriculars) {
      extracurricular.userId = id;
      promisesExtraCurricular.push(ExtraCurricular.create(extracurricular));
    }
    for (const workExperience of req.body.workExperiences) {
      workExperience.userId = id;
      promisesWorkExperience.push(WorkExperience.create(workExperience));
    }
    for (const language of req.body.languages) {
      language.userId = id;
      promisesLanguage.push(Language.create(language));
    }

    out.user = user;

    Promise.all([
      Promise.all(promisesSkill).then((results)=>{
        out.skills = results;
      }),
      Promise.all(promisesExtraCurricular).then((results)=>{
        out.extraCurriculars = results;
      }),
      Promise.all(promisesWorkExperience).then((results)=>{
        out.workExperiences = results;
      }),
      Promise.all(promisesLanguage).then((results)=>{
        out.languages = results;
      })])
        .then((output)=>{
          res.json(out);
        })
        .catch((err) => res.json(err));
  })
      .catch((err) => res.json(err));
});

router.post('/signup/company', (req, res) => {
  req.body.password = encryptPassword(req.body.password);
  Company.create(req.body)
      .then((company) => res.json(company))
      .catch((err) => res.json(err));
});

/**
 * Hashes the password of the user to allow it to be stored in the DB securely
 * @param {string} plaintext - Unhashed password
 * @return {password} - Hashed password
 */
function encryptPassword(plaintext) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(plaintext, salt);
  return (password);
}

/**
 * Logs the user in and generates a JWT for the user
 * @param {string} strategy - which passport strategy to use for authentication
 * @param {Request} req - HTTP request sent to the server
 * @param {Response} res - HTTP response
 */
function login(strategy, req, res) {
  passport.authenticate(strategy, {session: false}, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
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
