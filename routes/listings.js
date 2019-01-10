const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {JobListing, Application} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const {userOnly, companyOnly} = require('../middleware/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('*', [companyOnly, extractUserId]);
router.delete('*', [companyOnly, extractUserId]);

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
      companyId: req.userId,
    },
  })
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
  JobListing.destroy({
    where: {
      id: req.params.id,
      companyId: req.userId,
    },
  })
      .then((listing) => res.json(listing))
      .catch((err) => res.json(err));
});

router.get('/show/:id', userOnly, (req, res) => {
  JobListing.findOne({
    where: {
      id: req.params.id,
    },
  })
      .then((listing) => {
        listing.update({viewCount: listing.viewCount+1});
        res.json(listing);
      })
      .catch((err) => res.json(err));
});

router.get('/show/:id/applications', companyOnly, (req, res) => {
  JobListing.findOne({
    where: {
      id: req.params.id,
      companyId: req.userId
    },
    include: [Application],
  })
    .then((listing) => {
      res.json(listing);
    })
    .catch((err) => res.json(err));
});

// pmac super search
router.get('/search', userOnly, (req, res) => {
  const {q} = req.query;
  JobListing.findAll({
    where: {
      [Op.or]: [{
        position: {
          [Op.like]: `%${q}%`,
        },
      },
      {
        description: {
          [Op.like]: `%${q}%`,
        },
      },
      {
        street: {
          [Op.like]: `%${q}%`,
        },
      },
      {
        barangay: {
          [Op.like]: `%${q}%`,
        },
      },
      {
        city: {
          [Op.like]: `%${q}%`,
        },
      },
      {
        province: {
          [Op.like]: `%${q}%`,
        },
      },
      {
        strands: {
          [Op.like]: `%${q}%`.toString(),
        },
      },
      ],
    },
  })
      .then((listings) => {
        for (let i=0; i < listings.length; i++) {
          listings[i].update({viewCount: results[i].viewCount+1});
        }
        res.json(listings);
      })
      .catch((err) => res.json(err));
});

// refined search to position only
router.get('/simple-search', userOnly, (req, res) => {
  const {term} = req.query;
  term = term.toLowerCase();

  JobListing.findAll({
    where: {
      position: {
        [Op.like]: '%' + term + '%',
      },
    },
  })
      .then((listings) => {
        for (let i=0; i < listings.length; i++) {
          listings[i].update({viewCount: results[i].viewCount+1});
        }
        res.json(listings);
      })
      .catch((err) => console.log(err));
});

module.exports = router;
