const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const { User, Company } = require('./database.js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const jwtSettings = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWTSecret
}

const localAuthFields = {
    usernameField: 'email',
    passwordField: 'password'
}

passport.use('local', new LocalStrategy(localAuthFields,
    function (candidateEmail, candidatePassword, callback) {
        return User.findOne({ where: { email: candidateEmail } }).then(user => {
            if (!user) {
                return callback(null, false, { message: 'Incorrect email or password.' });
            }
            return validatePassword(candidatePassword, user, callback);
        }).catch(error => callback(error));
    }
));

passport.use('company-local', new LocalStrategy(localAuthFields,
    function (candidateEmail, candidatePassword, callback) {
        return Company.findOne({ where: { email: candidateEmail } }).then(company => {
            if (!company) {
                return callback(null, false, { message: 'Incorrect email or password.' });
            }
            return validatePassword(candidatePassword, company, callback);
        }).catch(error => callback(error));
    }
));

passport.use('jwt', new JWTStrategy(jwtSettings,
    function (jwtPayload, callback) {
        return User.findById(jwtPayload.id)
            .then(user => {return callback(null, user);})
            .catch(error => {return callback(error)});
    }
));

passport.use('company-jwt', new JWTStrategy(jwtSettings,
    function (jwtPayload, callback) {
        return Company.findById(jwtPayload.id)
            .then(company => {return callback(null, company)})
            .catch(error => {return callback(error);});
    }));

function validatePassword(candidate, user, callback) {
    bcrypt.compare(candidate, user.password, function (err, res) {
        if (res) {
            return callback(null, { id: user.id }, { message: 'Logged In Successfully' });
        }
        return callback(null, false, { message: 'Incorrect email or password.' });
    });
}