const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('profilePicture', {
    image: {
      type: Sequelize.BLOB,
      allowNull: false
    },
    mimetype : {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
}