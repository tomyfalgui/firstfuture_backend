const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('workExperience', {
        company: {
            type: Sequelize.STRING,
            allowNull: false
        },
        typeOfWork: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hours: {
            type: Sequelize.INTEGER(6),
            allowNull: false
        },
    });
}