const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {JobListing, User} = require('../database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
require('dotenv').config({path: '../.env'});

const feedSize = parseInt(process.env.feedSize);

router.get('/', (req, res, next)=>{
  User.findOne({where: {id: req.userId}}).then((user)=>{
    let fetchOlderThan = req.query.fetchOlderThan;
    fetchOlderThan ? {} : fetchOlderThan = '9999-12-31 23:59:59';
    JobListing.findAll({
      where: {
        [Op.and]: [
          {[Op.or]: [
            {strands: user.dataValues.strand},
            {strands: {[Op.like]: user.dataValues.strand + ';%'}},
            {strands: {[Op.like]: '%;' + user.dataValues.strand + ';%'}},
            {strands: {[Op.like]: '%;' + user.dataValues.strand}}],
          },
          {updatedAt: {[Op.lt]: fetchOlderThan}},
        ]},
      logging: console.log,
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: feedSize})
        .then((results)=>{
          if (results.length > 0) {
            res.json({
              posts: results,
              fetchOlderThan: results[results.length-1].updatedAt,
            });
          } else res.json([]);
        })
        .catch((err)=>res.json(err));
  }).catch((err)=>res.json(err));
});


module.exports = router;
