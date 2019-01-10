const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('refprovince', {
    psgcCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    provDesc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    regCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    provCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    defaultScope:{
      attributes:['provDesc','provCode']
    },
    scopes:{
      nameOnly:{
        attributes:['provDesc'],
      }
    },
  });
};
