const express = require('express');
var router = express.Router();
const {JobListing} = require('../database');

router.get('/',(req,res,next)=>{
    JobListing.findAll({where:{
        
    }})
});

module.exports = router;