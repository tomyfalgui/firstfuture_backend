const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
require('dotenv').config();
// eslint-disable-next-line max-len
const passport = require('passport');
const _ = require('lodash');
const { User, ExtraCurricular, Skill, Language, WorkExperience, City, Province } = require('../database');
const { extractUserId } = require('../middleware/id.js');

router.post('*', passport.authenticate('jwt', { session: false }));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('jwt', { session: false }));
router.delete('*', extractUserId);
router.get('*', passport.authenticate(['jwt', 'company-jwt'], { session: false }));

router.post('/edit', (req, res) => {
  User.update(_.omit(req.body.deltas,['verified']), {
    where: {
      id: req.userId
    }
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
      id: req.userId
    }
  })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res, next) => {
  User.findOne(
    {
      attributes:['id','firstName','lastName','middleName','userName','email'
        ,'phone','birthdate','sex','isGraduate','graduationDate','shs','strand',
        'generalAverage','gradeCeiling','honors','englishSpeakingRating','englishWritingRating',
        'englishReadingRating','filipinoSpeakingRating','filipinoWritingRating',
        'filipinoReadingRating',],
      where: { id: req.params.id }, 
      include: [
        {
          model: WorkExperience,
          attributes:['id','company','typeOfWork','description','hours','startDate','endDate']
        },
        {
          model: ExtraCurricular,
          attributes:['id','orgName','description','yearsActive','positionsHeld','startDate','endDate']
        }, 
        {
          model: Skill,
          attributes:['id','name','description','rating']
        },
        {
          model: Language,
          attributes:['id','name','speakingRating','readingRating','writingRating']
        }, 
        {
          model: City,
          include: [{
            model: Province,
          }]
        }
        ] 
    })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => res.json(err));
});

module.exports = router;
