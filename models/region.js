const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('refregion', {
    psgcCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    regDesc: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    regCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  });
};
