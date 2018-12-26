const passport = require('passport');
const passportJWT = require("passport-jwt");
const LocalStrategy = require('passport-local').Strategy;
const {User,Company} = require('./database.js');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (e, p, cb) {
        return User.findOne({where:{email:e}}).then(user => {
               if (!user) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
               }
               bcrypt.compare(p,user.password,function(err,res){
                    if(res){
                        return cb(null, {id:user.id}, {message: 'Logged In Successfully'});
                    }
                    return cb(null, false, {message: 'Incorrect email or password.'});
               });
            }).catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWTSecret
},
function (jwtPayload, cb) {
    return User.findById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));

passport.use('company-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, 
function (e, p, cb) {
    return Company.findOne({where:{email:e}}).then(user => {
           if (!user) {
               return cb(null, false, {message: 'Incorrect email or password.'});
           }
           bcrypt.compare(p,user.password,function(err,res){
                if(res){
                    return cb(null, {id:user.id}, {message: 'Logged In Successfully'});
                }
                return cb(null, false, {message: 'Incorrect email or password.'});
           });
        }).catch(err => cb(err));
}
));

passport.use('company-jwt', new JWTStrategy({
jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
secretOrKey   : process.env.JWTSecret
},
function (jwtPayload, cb) {
return Company.findById(jwtPayload.id)
    .then(user => {
        return cb(null, user);
    })
    .catch(err => {
        return cb(err);
    });
}
));