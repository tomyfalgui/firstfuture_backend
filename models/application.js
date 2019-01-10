const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('application', {
    userId: {
      type: Sequelize.INTEGER(11),
    },
    jobListingId: {
      type: Sequelize.INTEGER(11),
    },
    status: {
      type: Sequelize.INTEGER(2),
      defaultValue:0
    },
  },{
    defaultScope:{
      attributes:['userId','jobListingId','status','createdAt'],
    },
  });
};
