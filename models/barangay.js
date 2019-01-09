const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('refbrgy', {
    brgyCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    brgyDesc: {
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
    },
    citymunCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  });
};
