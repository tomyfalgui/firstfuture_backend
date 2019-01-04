const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('extraCurricular', {
    orgName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    yearsActive: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    positionsHeld: {
      type: Sequelize.JSON,
    },
  });
};
