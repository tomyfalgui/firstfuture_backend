const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const {User, Company} = require('./database.js');
const bcrypt = require('bcrypt');
// eslint-disable-next-line no-unused-vars
require('dotenv').config();
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const jwtSettings = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTSecret,
};

const localAuthFields = {
  usernameField: 'email',
  passwordField: 'password',
};

passport.use('local', new LocalStrategy(localAuthFields,
  function(sentEmail, sentPassword, cb) {
    return User.findOne({where: {email: sentEmail}}).then((user) => {
      if (!user) {
        return cb(null, false, {message: 'Invalid login'});
      }
      return validatePassword(sentPassword, user, cb);
    }).catch((error) => cb(error));
  }
));

passport.use('company-local', new LocalStrategy(localAuthFields,
  function(sentEmail, sentPassword, cb) {
    return Company.findOne({where: {email: sentEmail}}).then((company) => {
      if (!company) {
        return cb(null, false, {message: 'Invalid login'});
      }
      return validatePassword(sentPassword, company, cb, true);
    }).catch((error) => cb(error));
  }
));

passport.use('jwt', new JWTStrategy(jwtSettings,
  function(jwtPayload, cb) {
    if(!jwtPayload.isCompany){
    return User.findById(jwtPayload.id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((error) => {
          console.log(error);
          return cb(error);
        });
    }
    return cb(null,false);
  }
));

passport.use('company-jwt', new JWTStrategy(jwtSettings,
  function(jwtPayload, cb) {
    if(jwtPayload.isCompany){
      return Company.findById(jwtPayload.id)
          .then((company) => {
            return cb(null, company);
          })
          .catch((error) => {
            console.log(error);
            return cb(error);
          });
    }
    return cb(null,false);
}));

/**
 * Generates a callback for the JWT strategy based on the model passed
 * @param {object} model - sequelize model
 * @return {function} callback - generated callback function
 */
function generateJWTCallback(model) {
  let isComp = (model == Company ? true : false);
  return (function(claims, cb) {
    const assess = isComp ? claims.isCompany : !claims.isCompany;
    if (assess) {
      return model.findById(claims.id)
          .then((user) => {
            return cb(null, user);
          })
          .catch((error) => {
            return cb(error);
          });
    }
    return cb(null, false);
  });
}

/**
 * Generates a callback for the local strategy based on the model passed
 * @param {object} model - sequelize model
 * @return {function} callback - generated callback function
 */
function generateLocalCallback(model) {
  const isCompany = model == Company ? true : false;
  return function(sentEmail, sentPassword, cb) {
    return model.findOne({where: {email: sentEmail}}).then((out) => {
      if (!out) {
        return cb(null, false, {message: 'Invalid login'});
      } else return validatePassword(sentPassword, out, cb, isCompany);
    }).catch((error) => cb(error));
  };
}

/**
 * Determines if password input matches the passport stored in the database.
 * @param {string} candidate - The password input by the user.
 * @param {object} user - The object holding the password stored in the DB.
 * @param {function} cb - The cb of the function.
 * @param {boolean} isCompany - if the user is or is not a company
 */
function validatePassword(candidate, user, cb, isCompany = false) {
  bcrypt.compare(candidate, user.password, function(err, res) {
    if (res) {
      return cb(null, {id: user.id, isCompany: isCompany},
          {message: 'Logged in'});
    }
    return cb(null, false, {message: 'Incorrect email or password.'});
  });
}
