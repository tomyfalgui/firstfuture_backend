const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {JobListing} = require('../database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const passport = require('passport');
const {extractUserId} = require('../middleware/id.js');

router.post('*', passport.authenticate('company-jwt', {session: false}));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('company-jwt', {session: false}));
router.delete('*', extractUserId);

router.post('/new', (req, res) => {
  req.body.companyId = req.userId;
  JobListing.create(req.body)
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

router.post('/edit', (req, res) => {
  JobListing.update(req.body.deltas, {
    where: {
      id: req.body.id,
      companyId: req.userId}})
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
  JobListing.destroy({
    where: {
      id: req.params.id,
      companyId: req.userId}})
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res) => {
  JobListing.findOne({
    where: {
      id: req.params.id}})
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

router.get('/search', (req, res) => {
  const {q} = req.query;
  JobListing.findAll({
    where: {
      [Op.or]: [
        {position: {[Op.like]: `%${q}%`}},
        {description: {[Op.like]: `%${q}%`}},
        {street: {[Op.like]: `%${q}%`}},
        {barangay: {[Op.like]: `%${q}%`}},
        {city: {[Op.like]: `%${q}%`}},
        {province: {[Op.like]: `%${q}%`}},
        {strands: {[Op.like]: `%${q}%`.toString()}},
      ],
    },
  })
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

module.exports = router;
