const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('profilePicture', {
    image: {
      type: Sequelize.BLOB
    }
  });
}