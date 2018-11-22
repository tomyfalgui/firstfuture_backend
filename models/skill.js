const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('skill', {
        name: {
            type: Sequelize.STRING
          },
        description: {
            type: Sequelize.STRING
          },
          rating: {
            type: Sequelize.INTEGER(2)
          },
    });
}