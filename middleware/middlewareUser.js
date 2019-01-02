var middleware = {
    extractUserId : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.userId = jwt.id;
        next();
    }
}
module.exports = middleware;