const Sequelize = require('sequelize');

module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    // ID is auto-generated
    // Name
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    middleName: {
      type: Sequelize.STRING,
    },
    // Account Information
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    profilePicturePath: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    passwordResetToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // Contact Information
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: {
        args: true,
        msg: 'Email address already in use!',
      },
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // Birthday
    birthdate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // Sex
    sex: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    // Academic Information
    isGraduate: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    graduationDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    shs: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    strand: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    generalAverage: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    gradeCeiling: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    honors: {
      type: Sequelize.JSON,
    },
    englishSpeakingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    englishWritingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    englishReadingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    filipinoSpeakingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    filipinoWritingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
    filipinoReadingRating: {
      type: Sequelize.INTEGER(2),
      allowNull: false,
    },
  },{
    // By default allows access only to user visible data
    defaultScope:{
      attributes:['id','firstName','lastName','middleName','userName','email'
      ,'phone','birthdate','sex','isGraduate','graduationDate','shs','strand',
      'generalAverage','gradeCeiling','honors','englishSpeakingRating','englishWritingRating',
      'englishReadingRating','filipinoSpeakingRating','filipinoWritingRating',
      'filipinoReadingRating',],
    },
    scopes : {
      auth:{
        attributes:['id','password','email','verified']
      },
      minimal:{
        attributes:['id','firstName','lastName']
      }
    }
  });
};
