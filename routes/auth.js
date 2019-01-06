const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config({path: '../.env'});
const bcrypt = require('bcrypt');
const smtpTransport = require('../mailer');
const crypto = require('crypto');
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

router.post('/account_recovery/student', (req, res) => {
  recoverAccount(User, req, res);
});

router.post('/password_reset/student', (req, res) => {
  passwordReset(User, req, res);
});

router.post('/account_recovery/company', (req, res) => {
  recoverAccount(Company, req, res);
});

router.post('/password_reset/company', (req, res) => {
  passwordReset(Company, req, res);
});

/**
 * Resets password stored in the database given the user defined in the request
 * @param {object} model - Sequelize model
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function passwordReset(model, req, res) {
  try {
    const isStudent = (model == User);
    // eslint-disable-next-line max-len
    const secret = isStudent? process.env.JWTSecret : process.env.CompanyJWTSecret;
    const decoded = jwt.verify(req.body.token, secret);
    const validRole = isStudent? decoded.isStudent : !decoded.isStudent;
    if (validRole) {
      const deltas = {
        password: encryptPassword(req.body.newPassword),
        passwordResetToken: null,
      };
      const identifiers = {
        where: {
          id: decoded.user,
          passwordResetToken: decoded.resetToken,
        },
      };
      model.update(deltas, identifiers).then(()=> {
        res.json(true);
      });
    } else throw new Error('Role mismatch');
  } catch (err) {
    res.json(err);
  }
}

/**
 * Sends password reset email and logs reset request into the database
 * @param {object} model - Sequelize model
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function recoverAccount(model, req, res) {
  const isStudent = model == User ? true : false;
  model.findOne({where: {email: req.body.email}}).then((out)=>{
    const buffer = crypto.randomBytes(30).toString('hex');
    const claims = {
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      user: out.id,
      resetToken: buffer,
      isStudent: isStudent,
    };
    const passwordResetJWT = jwt.sign(claims, process.env.JWTSecret);
    out.update({passwordResetToken: buffer}).then(()=>{
      const name = isStudent ? out.firstName : userName;
      const data = {
        to: out.email,
        from: process.env.MAILER_SERVICE_USER,
        template: 'forgotPasswordUser',
        subject: 'Password reset instructions',
        context: {
          url: process.env.RESET_URL + passwordResetJWT,
          name: name,
        },
      };
      smtpTransport.sendMail(data, function(err) {
        if (!err) {
          res.json(true);
        } else res.json(err);
      });
    });
  })
      .catch((err)=> res.json(new Error('Unable to reset password')));
}

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
