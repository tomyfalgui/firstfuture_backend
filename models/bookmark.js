const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
    return sequelize.define('bookmark', {
        userID : {
            type: Sequelize.INTEGER(11)
          },
        listingID : {
            type: Sequelize.INTEGER(11)
          },
    });
}