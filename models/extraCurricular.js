const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('extraCurricular', {
    orgName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    yearsActive: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    positionsHeld: {
      type: Sequelize.JSON,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },{
    validate:{
      startLessThanEnd(){
        if((this.startDate>this.endDate) && (this.endDate != null)){
          throw new Error('Start date can\'t be after the end date!');
        }
      },
    },
    defaultScope:{
      attributes: {exclude: ['createdAt','updatedAt']}
    },
  });
};
