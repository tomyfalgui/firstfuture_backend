var middleware = {
    extractCompanyIdBody : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.body.companyId = jwt.id;
        next();
    },
    extractCompanyIdParams : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.params.companyId = jwt.id;
        next();
    },
    extractCompanyIdQuery : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.query.companyId = jwt.id;
        next();
    }
}
module.exports = middleware;