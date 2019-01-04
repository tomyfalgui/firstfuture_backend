const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('skill', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    rating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
  });
}