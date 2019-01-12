require('dotenv').config({path: '../.env'});
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {JobListing, User} = require('../database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
          {isImmersion: !user.isGraduate},
        ]},
      order: [
        ['updatedAt', 'DESC'],
      ],
      limit: feedSize})
        .then((results)=>{
          for (let i=0; i < results.length; i++) {
            results[i].update({viewCount: results[i].viewCount+1});
          }
          res.json({
            posts: results,
            fetchOlderThan: results[results.length-1].updatedAt,
          });
        })
        .catch((err)=>res.json(err));
  }).catch((err)=>res.json(err));
});


module.exports = router;
