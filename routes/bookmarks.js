const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Bookmark,JobListing} = require('../database');
const {userIdToBody} = require('../middleware/id.js');

router.get('/show', (req,res) => {
  Bookmark.findAll({
    where:{userId:req.userId}, 
    include:[JobListing]})
    .then((listings)=>{
      res.json(listings);
    });
});

router.post('/new', userIdToBody, (req, res) => {
  Bookmark.create(req.body)
      .then((bookmark) => res.json(bookmark))
      .catch((err) => res.json(err));
});

router.delete('/delete/:id', (req, res) => {
  Bookmark.destroy({
    where: {
      id: req.params.id,
      userId: req.userId}})
      .then((bookmark) => res.json(bookmark))
      .catch((err) => res.json(err));
});

module.exports = router;
