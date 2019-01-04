var middleware = {
    extractUserId : function(req,res,next){
        var jwt = JSON.parse(new Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.userId = jwt.id;
        next();
    },
    userIdToBody : function(req,res,next){
        req.body.userId = req.userId;
        next()
    }
}
module.exports = middleware;