const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
    return sequelize.define('user', {
    // ID is auto-generated
    // Name
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    middleName: {
      type: Sequelize.STRING
    },
    // Account Information
    userName: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
    // Contact Information
    email: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    // Address Section
    street:{
      type: Sequelize.STRING
    },
    barangay:{
      type: Sequelize.STRING
    },
    city:{
      type: Sequelize.STRING
    },
    province:{
      type: Sequelize.STRING
    },
    // Birthday
    birthdate:{
      type: Sequelize.DATE
    },
    // Sex
    sex:{
      type: Sequelize.BOOLEAN
    },
    // Academic Information
    isGraduate:{
      type: Sequelize.BOOLEAN
    },
    graduationDate:{
      type: Sequelize.DATE,
      allowNull: true
    },
    shs:{
      type: Sequelize.STRING
    },
    strand:{
      type: Sequelize.INTEGER(2)
    },
    generalAverage:{
      type: Sequelize.FLOAT
    },
    honors:{
      type: Sequelize.JSON
    },
    englishSpeakingRating: {
      type: Sequelize.INTEGER(2)
    },
    englishWritingRating: {
      type: Sequelize.INTEGER(2)
    },
    englishReadingRating: {
      type: Sequelize.INTEGER(2)
    },
    filipinoSpeakingRating: {
      type: Sequelize.INTEGER(2)
    },
    filipinoWritingRating: {
      type: Sequelize.INTEGER(2)
    },
    filipinoReadingRating: {
      type: Sequelize.INTEGER(2)
    },
  });
}