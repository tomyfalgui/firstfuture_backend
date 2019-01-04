const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('company', {
    userName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contactNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false
    },
    barangay: {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    province: {
      type: Sequelize.STRING,
      allowNull: false
    },
  });
}
