const Sequelize = require('sequelize');
module.exports = (sequelize, type) => {
  return sequelize.define('workExperience', {
    company: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    typeOfWork: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    hours: {
      type: Sequelize.INTEGER(6),
      allowNull: false,
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
      }
    }
  });
};
