const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('refcitymun', {
    psgcCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    citymunDesc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    regDesc: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    provCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    citymunCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
  });
};
