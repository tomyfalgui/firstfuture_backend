const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('jobListingSkill', {
    jobListingId: {
      type: Sequelize.INTEGER(11)
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    }
  });
}