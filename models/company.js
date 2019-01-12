const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('company', {
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    passwordResetToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: {
        args: true,
        msg: 'Email address already in use!',
      },
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },{
    defaultScope:{
      attributes:['userName','email',
      'companyName','contactNumber','description','city']
    },
    scopes:{
      auth:{
        attributes:['id','password','email','verified']
      },
      nameOnly:{
        attributes:['companyName']
      }
    }
  });
};
