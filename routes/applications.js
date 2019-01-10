const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Application, JobListing} = require('../database');
const {studentOnly, companyOnly} = require('../middleware/auth');

router.delete('*', studentOnly);
router.get('*', studentOnly);

router.post('/new', studentOnly, (req, res) => {
  Application.create({
    userId: req.userId,
    jobListingId: req.body.jobListingId,
  })
      .then((application) => res.json(application))
      .catch((err) => res.json(err));
});

// Update middleware to limit to companies
router.post('/edit', companyOnly, (req, res) => {
  Application.findOne({where: {id: req.body.id}, include: [JobListing]})
      .then((application) => {
        console.log(application.dataValues.jobListing);
        if (application.dataValues.jobListing.jobListing.dataValues.companyId == req.userId) {
          application.update({status: req.body.status}).then((out)=>{
            res.json(out);
          });
        } else res.json(new Error('Unauthorized'));
      })
      .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
  Application.destroy({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  })
      .then((application) => res.json(application))
      .catch((err) => res.json(err));
});

router.get('/show/', (req, res) => {
  Application.findAll({
    where: {
      userId: req.userId,
    },
  })
      .then((applications) => res.json(applications))
      .catch((err) => res.json(err));
});

router.get('/show/:id', (req, res) => {
  Application.findOne({
    where: {
      id: req.params.id,
      userId: req.userId,
    },
  })
      .then((application) => res.json(application))
      .catch((err) => res.json(err));
});

router.get('/show/status/:status', (req, res) => {
  Application.findAll({
    where: {
      status: req.params.status,
      userId: req.userId,
    },
  })
      .then((applications) => res.json(applications))
      .catch((err) => res.json(err));
});


module.exports = router;
