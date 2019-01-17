const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('jobListing', {
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jobLocation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    deadline: {
      type: Sequelize.DATE,
    },
    category: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    industry: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    viewCount: {
      type: Sequelize.INTEGER(6),
      defaultValue: 0,
      allowNull: false,
    },
    requiredSkills: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    benefits: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    isImmersion:{
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    strands: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        try {
          // eslint-disable-next-line prefer-const
          let results = this.getDataValue('strands').split(';');
          for (let i = 0; i < results.length; i++) {
            results[i] = parseInt(results[i]);
          }
          return (results);
        } catch (err) {
          return (null);
        }
      },
      set(val) {
        this.setDataValue('strands', val.join(';'));
      },
    },
  },{
    defaultScope:{
    },
    scopes:{
    }
  });
};
