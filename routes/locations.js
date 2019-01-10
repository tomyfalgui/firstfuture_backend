const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {Province, City} = require('../database');

router.get('/provinces/:regionId', (req, res) => {
  findChildrenLocations(Province, {regCode: req.params.regionId}, res);
});

router.get('/cities/:provinceId', (req, res) => {
  findChildrenLocations(City, {provCode: req.params.provinceId}, res);
});

/**
 * Finds locations under a specified location (i.e. Cities in a Province)
 * @param {object} model - Checks which model to look under
 * @param {object} query - Determines search parameters
 * @param {Response} res - HTTP Response
 */
function findChildrenLocations(model, query, res) {
  model.findAll({where: query}).then((locations)=>{
    res.json(locations);
  })
      .catch(()=> res.json(new Error('Error fetching locations')));
}

module.exports = router;
