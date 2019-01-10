require('dotenv').config();
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {User, ExtraCurricular, Skill,
  Language, WorkExperience, City, Province} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const {studentOnly, userOnly} = require('../middleware/auth');

router.post('*', [studentOnly, extractUserId]);
router.delete('*', [studentOnly, extractUserId]);
router.get('*', userOnly);

router.post('/edit', (req, res) => {
  User.update(req.body.deltas, {
    where: {
      id: req.userId,
    },
    fields: ['id', 'firstName', 'lastName', 'password', 'middleName',
      'userName', 'email', 'phone', 'birthdate', 'sex', 'isGraduate',
      'graduationDate', 'shs', 'strand', 'generalAverage', 'gradeCeiling',
      'honors', 'englishSpeakingRating', 'englishWritingRating',
      'englishReadingRating', 'filipinoSpeakingRating',
      'filipinoWritingRating', 'filipinoReadingRating'],
  })
      .then((user) => {
        delete user.password;
        res.json(user);
      })
      .catch((err) => res.json(err));
});

router.delete('/delete', (req, res) => {
  User.destroy({
    where: {
      id: req.userId,
    },
  })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res, next) => {
  User.findOne(
      {
        where: {id: req.params.id},
        include: [WorkExperience, ExtraCurricular, Skill, Language,
          {
            model: City.scope('nameOnly'),
            include: [{
              model: Province.scope('nameOnly'),
            }],
          }],
      })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => res.json(err));
});

module.exports = router;
