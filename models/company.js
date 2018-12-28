const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('company', {
    userName: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
    companyName: {
      type: Sequelize.STRING
    },
    contactNumber: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    street: {
      type: Sequelize.STRING
    },
    barangay: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    province: {
      type: Sequelize.STRING
    },
  });
}
