const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('application', {
        applicantID: {
            type: Sequelize.INTEGER(11)
        },
        jobListingID: {
            type: Sequelize.INTEGER(11)
        },
        status: {
            type: Sequelize.INTEGER(2)
        }
    });
}