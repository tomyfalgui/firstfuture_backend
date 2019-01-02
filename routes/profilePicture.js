const express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();
const {ProfilePicture } = require('../database');
const passport = require('passport');
const {extractUserId} = require('../middleware/middlewareUser.js');

router.post('*', passport.authenticate('jwt', { session: false }));
router.post('*', extractUserId);
router.delete('*', passport.authenticate('jwt', { session: false }));
router.delete('*', extractUserId);

router.post('/new/profilePicture', (req, res, next) => {
    ProfilePicture.count({where:{userId : req.userId}}).then((count)=>{
        console.log(count);
        if(count == 0){
            ProfilePicture.create({image:req.files.image.data, mimetype:req.files.image.mimetype, userId:req.userId}).then(() =>
            res.json(true));
        }
        else{
            ProfilePicture.update({image:req.files.image.data, mimetype:req.files.image.mimetype}, { where: {userId: req.userId }})
            .then(res.json(true));
        }
    })
});

router.delete('/delete/profilePicture', (req, res) => {
    ProfilePicture.destroy({ where: { id: req.query.id, userId: req.userId } })
        .then(res.json(true));
});

router.get('/show/profilePicture/:id',(req,res,next)=>{
    ProfilePicture.findOne({
        where: {
            userId: req.params.id       
        }
    }).then((result)=>{
        res.set('Content-Type', result.mimetype);
        res.send(result.image);
    })
});

module.exports = router;