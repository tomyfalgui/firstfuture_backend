const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {JobListing, Application, Company, City, User} = require('../database');
const {extractUserId} = require('../middleware/id.js');
const {userOnly, companyOnly} = require('../middleware/auth');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const csvConverter = require('json-2-csv');

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

router.get('/show/', [userOnly,extractUserId], (req, res) => {
  JobListing.findAll({
    where: {
      companyId: req.userId
    },
  })
    .then((listings) => {
      res.json(listings);
    })
    .catch((err) => res.json(err));
});

router.get('/show/:id', userOnly, (req, res) => {
  JobListing.findOne({
    where: {
      id: req.params.id,
    },
    include: [Company,City],
  })
      .then((listing) => {
        listing.update({viewCount: listing.viewCount+1});
        res.json(listing);
      })
      .catch((err) => res.json(err));
});

// eslint-disable-next-line max-len
router.get('/show/:id/applications', [companyOnly, extractUserId], (req, res) => {
  JobListing.findOne({
    where: {
      id: req.params.id,
      companyId: req.userId,
    },
    include: [{
      model: Application,
      include: [User.scope('minimal')],
    }],
  })
      .then((listing) => {
        res.json(listing);
      })
      .catch((err) => res.json(err));
});

// eslint-disable-next-line max-len
router.get('/show/:id/applications/download', [companyOnly, extractUserId], (req, res) => {
  JobListing.findOne({
    where: {
      id: req.params.id,
      companyId: req.userId,
    },
    attributes: ['position'],
    include: [{
      model: Application,
      include: [User.scope('minimal')],
    }],
    raw: true,
  })
      .then((listing) => {
        const filename = listing.position+'-'+new Date().toLocaleDateString();
        res.setHeader('Content-disposition',
            'attachment; filename='+filename+'.csv');
        res.set('Content-Type', 'text/csv');
        csvConverter.json2csvAsync(listing).then((csv)=>{
          res.status(200).send(csv);
        });
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
router.get('/search/position', userOnly, (req, res) => {
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

router.get('/search/location/:cityId', userOnly, (req, res) => {
  JobListing.findAll({where:{city:req.params.cityId}}).then((listings)=>{
    res.json(listings);
  }).catch((err)=>{
    res.json(err);
  })
});

module.exports = router;
