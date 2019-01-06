const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
require('dotenv').config();
const { CompanyPicture, Company } = require('../database');
const passport = require('passport');
const { extractUserId } = require('../middleware/id.js');

router.post('*', passport.authenticate('company-jwt', { session: false }));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('company-jwt', { session: false }));
router.delete('*', extractUserId);

router.post('/new/profile', (req, res, next) => {
  Company.findOne({ where: { id: req.userId } }).then((company) => {
    if (company.profilePicture == null) {
      createCompanyPicture(true,req,res);
    } else {
      updateCompanyPicture('profilePicture',req,res);
    }
  });
});

router.post('/new/cover', (req, res, next) => {
  Company.findOne({ where: { id: req.userId } }).then((company) => {
    if (company.coverPicture == null) {
      createCompanyPicture(false,req,res);
    } else {
      updateCompanyPicture('coverPicture',req,res);
    }
  });
});

router.delete('/delete/:id', (req, res) => {
  CompanyPicture.destroy({
    where: {
      id: req.params.id,
      companyId: req.userId
    }
  })
    .then(res.json(true))
    .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res, next) => {
  CompanyPicture.findOne({
    where: {
      companyId: req.params.id
    }
  })
    .then((result) => {
      res.set('Content-Type', result.mimetype);
      res.send(result.image);
    })
    .catch((err) => res.json(err));
});

function createCompanyPicture(isProfile, req, res) {
  CompanyPicture.create({
    image: req.files.image.data,
    mimetype: req.files.image.mimetype,
    companyId: req.userId
  })
    .then(() => {
      isProfile ? company.update({ profilePicture: image.id }).then(()=>res.json(true)) : company.update({ coverPicture: image.id }).then(()=>res.json(true));
    })
    .catch((err) => res.json(err));
}
function updateCompanyPicture(isProfile, req, res) {
  CompanyPicture.update({
    image: req.files.image.data,
    mimetype: req.files.image.mimetype
  },
    {
      where: {
        companyId: (isProfile ? parseInt(company.profilePicture) : parseInt(company.coverPicture))
      }
    })
    .then((image) => {
      company.update({ pictureType: image.id }).then(res.json(image));
    })
    .catch((err) => res.json(err));
}

module.exports = router;