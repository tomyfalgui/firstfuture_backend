var middleware = {
    extractCompanyId : function(req,res,next){
        var jwt = JSON.parse(new Buffer(req.headers.authorization.split(' ')[1].split('.')[1], 'base64').toString());
        req.companyId = jwt.id;
        next();
    },
    companyIdToBody : function(req,res,next){
        req.body.userId = req.companyId;
        next()
    }
}
module.exports = middleware;