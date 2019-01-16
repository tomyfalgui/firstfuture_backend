const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('language', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
  },{
    defaultScope:{
      attributes: {exclude: ['createdAt','updatedAt']}
    }
  });
};
