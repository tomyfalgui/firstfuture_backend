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

const companyJwtSettings = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.CompanyJWTSecret,
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
        return validatePassword(sentPassword, company, cb);
      }).catch((error) => cb(error));
    }
));

passport.use('jwt', new JWTStrategy(jwtSettings,
    function(jwtPayload, cb) {
      return User.findById(jwtPayload.id)
          .then((user) => {
            return cb(null, user);
          })
          .catch((error) => {
            return cb(error);
          });
    }
));

passport.use('company-jwt', new JWTStrategy(companyJwtSettings,
    function(jwtPayload, cb) {
      return Company.findById(jwtPayload.id)
          .then((company) => {
            return cb(null, company);
          })
          .catch((error) => {
            return cb(error);
          });
    }));

/**
 * Determines if password input matches the passport stored in the database.
 * @constructor
 * @param {object} candidate - The password input by the user.
 * @param {object} user - The object holding the password stored in the DB.
 * @param {function} cb - The cb of the function.
 */
function validatePassword(candidate, user, cb) {
  bcrypt.compare(candidate, user.password, function(err, res) {
    if (res) {
      return cb(null, {id: user.id}, {message: 'Logged In Successfully'});
    }
    return cb(null, false, {message: 'Incorrect email or password.'});
  });
}
