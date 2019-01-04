const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('bookmark', {
    userId: {
      type: Sequelize.INTEGER(11),
    },
    jobListingId: {
      type: Sequelize.INTEGER(11),
    },
  });
};
