const passport = require('passport');

const middleware = {
  studentOnly: passport.authenticate('jwt', {session: false}),
  companyOnly: passport.authenticate('company-jwt', {session: false}),
  userOnly: passport.authenticate(['jwt', 'company-jwt'], {session: false}),
};

module.exports = middleware;
