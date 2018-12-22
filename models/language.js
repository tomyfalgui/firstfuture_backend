const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('language', {
    name: {
      type: Sequelize.STRING
    },
    speakingRating: {
      type: Sequelize.INTEGER(2)
    },
    writingRating: {
      type: Sequelize.INTEGER(2)
    },
    readingRating: {
      type: Sequelize.INTEGER(2)
    },
  });
}