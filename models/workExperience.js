const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('workExperience', {
        company: {
            type: Sequelize.STRING
          },
        typeOfWork: {
            type: Sequelize.STRING
          },
        hours: {
            type: Sequelize.INTEGER(6)
          },
    });
}