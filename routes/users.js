const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const { User, ExtraCurricular, Skill, Language, WorkExperience, ProfilePicture } = require('../database');
const passport = require('passport');
const middleware = require('../middleware/middlewareUser.js');

router.post('/new/profilePicture', middleware.extractUserIdBody, (req, res, next) => {
    ProfilePicture.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/skill', middleware.extractUserIdBody, (req, res) => {
    Skill.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/workExperience', middleware.extractUserIdBody, (req, res) => {
    WorkExperience.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/language', middleware.extractUserIdBody, (req, res) => {
    Language.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/new/extraCurricular', middleware.extractUserIdBody, (req, res) => {
    ExtraCurricular.create(req.body).then(() =>
        res.json(true)
    );
});

router.post('/edit', middleware.extractUserIdBody, (req, res) => {
    User.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(user => res.json(user));
});

router.post('/edit/skills', middleware.extractUserIdBody, (req, res) => {
    Skill.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(skill => res.json(skill));
});

router.post('/edit/profilePicture', middleware.extractUserIdBody, (req, res) => {
    ProfilePicture.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(skill => res.json(skill));
});

router.post('/edit/extraCurricular', middleware.extractUserIdBody, (req, res) => {
    ExtraCurricular.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(extracurricular => res.json(extracurricular));
});

router.post('/edit/language', middleware.extractUserIdBody, (req, res) => {
    Language.update(req.body.deltas, { where: { id: req.body.id, userId: req.body.userId } })
        .then(language => res.json(language));
});

router.delete('/delete', middleware.extractUserIdQuery, (req, res) => {
    User.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/skill', (req, res) => {
    Skill.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/extraCurricular', (req, res) => {
    ExtraCurricular.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

router.delete('/delete/language', (req, res) => {
    Language.destroy({ where: { id: req.query.id, userId: req.query.userId } })
        .then(res.json(true));
});

module.exports = router;