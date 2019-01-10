const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('language', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    speakingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    writingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    readingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
  },{
    defaultScope:{
      attributes: {exclude: ['createdAt','updatedAt']}
    }
  });
};
