const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
require('dotenv').config();
const {ProfilePicture} = require('../database');
const passport = require('passport');
const {extractUserId} = require('../middleware/id.js');

router.post('*', passport.authenticate('jwt', {session: false}));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('jwt', {session: false}));
router.delete('*', extractUserId);

router.post('/new', (req, res, next) => {
  ProfilePicture.count({where: {userId: req.userId}})
      .then((count)=>{
        if (count == 0) {
          ProfilePicture.create({
            image: req.files.image.data,
            mimetype: req.files.image.mimetype,
            userId: req.userId})
              .then((image) => res.json(image))
              .catch((err)=>res.json(err));
        } else {
          ProfilePicture.update({
            image: req.files.image.data,
            mimetype: req.files.image.mimetype},
          {where: {
            userId: req.userId}})
              .then(res.json(true))
              .catch((err)=>res.json(err));
        }
      })
      .catch((err)=>res.json(err));
});

router.delete('/delete', (req, res) => {
  ProfilePicture.destroy({
    where: {
      userId: req.userId}})
      .then(res.json(true))
      .catch((err)=>res.json(err));
});

router.get('/show/:id', (req, res, next)=>{
  ProfilePicture.findOne({
    where: {
      userId: req.params.id}})
      .then((result)=>{
        res.set('Content-Type', result.mimetype);
        res.send(result.image);
      })
      .catch((err)=>res.json(err));
});

module.exports = router;
