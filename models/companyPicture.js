// Temp until directory is fixed
const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('companyPicture', {
    image: {
      type: Sequelize.BLOB,
      allowNull: false,
    },
    mimetype: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    defaultScope:{
      attributes: {exclude: ['createdAt','updatedAt']}
    }
  });
};
