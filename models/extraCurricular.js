const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('extraCurricular', {
        orgName: {
            type: Sequelize.STRING
          },
          yearsActive: {
            type: Sequelize.INTEGER(2)
          },
          positionsHeld: {
            type: Sequelize.JSON
          },
    });
}