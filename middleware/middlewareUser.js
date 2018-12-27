var middleware = {
    extractUserIdBody : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.body.userId = jwt.id;
        next();
    },
    extractUserIdParams : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.params.userId = jwt.id;
        next();
    },
    extractUserIdQuery : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.query.userId = jwt.id;
        next();
    }
}
module.exports = middleware;