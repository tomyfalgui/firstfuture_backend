const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('bookmark', {
    userId: {
      type: Sequelize.INTEGER(11)
    },
    listingId: {
      type: Sequelize.INTEGER(11)
    },
  });
}