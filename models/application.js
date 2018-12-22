const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('extraCurricular', {
    applicantID: {
      type: Sequelize.INTEGER(11)
    },
    jobListingID: {
      type: Sequelize.INTEGER(11)
    },
    status: {
      type: Sequelize.INTEGER(2)
    }
  });
}