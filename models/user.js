const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    // ID is auto-generated
    // Name
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    middleName: {
      type: Sequelize.STRING
    },
    // Account Information
    userName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // Contact Information
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail:true
      },
      unique: {
          args: true,
          msg: 'Email address already in use!'
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // Address Section
    street: {
      type: Sequelize.STRING,
      allowNull: false
    },
    barangay: {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    province: {
      type: Sequelize.STRING,
      allowNull: false
    },
    // Birthday
    birthdate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    // Sex
    sex: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    // Academic Information
    isGraduate: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    graduationDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    shs: {
      type: Sequelize.STRING,
      allowNull: false
    },
    strand: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    generalAverage: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    honors: {
      type: Sequelize.JSON
    },
    englishSpeakingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    englishWritingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    englishReadingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    filipinoSpeakingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    filipinoWritingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    filipinoReadingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
  });
}
