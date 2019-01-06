const middleware = {
  extractUserId: function(req, res, next) {
    const jwtClaims = req.headers.authorization.split(' ')[1].split('.')[1];
    // eslint-disable-next-line new-cap
    const jwt = JSON.parse(new Buffer.from(jwtClaims, 'base64').toString());
    req.userId = jwt.id;
    next();
  },
  userIdToBody: function(req, res, next) {
    req.body.userId = req.userId;
    next();
  },
};
module.exports = middleware;
