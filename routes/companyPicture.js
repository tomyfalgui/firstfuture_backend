const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
require('dotenv').config();
const {CompanyPicture, Company} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const {userOnly, companyOnly} = require('../middleware/auth');

router.post('*', [companyOnly, extractUserId]);
router.delete('*', [companyOnly, extractUserId]);
router.get('*', userOnly);

router.post('/new/profile', (req, res, next) => {
  Company.findOne({where: {id: req.userId}}).then((company) => {
    if (company.profilePicture == null) {
      createCompanyPicture(true, req, res);
    } else {
      updateCompanyPicture('profilePicture', req, res);
    }
  });
});

router.post('/new/cover', (req, res, next) => {
  Company.findOne({where: {id: req.userId}}).then((company) => {
    if (company.coverPicture == null) {
      createCompanyPicture(false, req, res);
    } else {
      updateCompanyPicture('coverPicture', req, res);
    }
  });
});

router.delete('/delete/:id', (req, res) => {
  CompanyPicture.destroy({
    where: {
      id: req.params.id,
      companyId: req.userId,
    },
  })
      .then(res.json(true))
      .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res, next) => {
  CompanyPicture.findOne({
    where: {
      companyId: req.params.id,
    },
  })
      .then((result) => {
        res.set('Content-Type', result.mimetype);
        res.send(result.image);
      })
      .catch((err) => res.json(err));
});

/**
 * Creates an image for the company specified in the request
 * @param {Boolean} isProfile - If image to be added is a profile pic or not
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function createCompanyPicture(isProfile, req, res) {
  CompanyPicture.create({
    image: req.files.image.data,
    mimetype: req.files.image.mimetype,
    companyId: req.userId,
  })
      .then(() => {
    isProfile ? company.update({profilePicture: image.id}).then(res.json(true))
     : company.update({coverPicture: image.id}).then(res.json(true));
      })
      .catch((err) => res.json(err));
}

/**
 * Updates an image for the company specified in the request
 * @param {Boolean} isProfile - If image to be updated is a profile pic or not
 * @param {Request} req - HTTP Request
 * @param {Response} res - HTTP Response
 */
function updateCompanyPicture(isProfile, req, res) {
  const imageId = isProfile ? company.profilePicture : company.coverPicture;
  CompanyPicture.update({
    image: req.files.image.data,
    mimetype: req.files.image.mimetype,
  },
  {
    where: {
      id: parseInt(imageId),
    },
  })
      .then((image) => {
        company.update({pictureType: image.id}).then(res.json(image));
      })
      .catch((err) => res.json(err));
}

module.exports = router;
