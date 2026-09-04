module.exports.loginMiddleware=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Have to Login First to add new Listings!!!");
    req.session.redirectUrl=req.originalUrl;
    return res.redirect("/user/login");
}
module.exports.bookingMiddleware=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Have to Login/SignUp to Own!!!");
    req.session.redirectUrl=req.originalUrl;
    return res.redirect("/user/login");
}
module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    return next();
}