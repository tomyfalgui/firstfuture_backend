const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('jobListing', {
          companyID: {
            type: Sequelize.INTEGER(11)
          },
          isGAS: {
            type: Sequelize.BOOLEAN
          },
          isICT: {
            type: Sequelize.BOOLEAN
          },
          isSTEM: {
            type: Sequelize.BOOLEAN
          },
          isABM: {
            type: Sequelize.BOOLEAN
          },
    });
}