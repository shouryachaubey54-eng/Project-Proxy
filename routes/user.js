const express=require("express");
const User=require("../models/user.js");
const wrapAsync = require("../utilities/wrapAsync.js");
const {redirectUrl}=require("../utilities/middleware.js");
const router=express.Router();
const passport=require("passport");
router.get("/signup",async (req,res)=>{
    res.render("listings/signUp.ejs");
})
router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        const {username,password,email}=req.body;
    const user1=new User({username:username,email:email});
    const validUser=await User.register(user1,password);
    req.login(validUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome New User!!!");
        return res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }
    
}))
router.get("/login",(req,res)=>{
    res.render("listings/login.ejs");
})
router.post("/login",redirectUrl,passport.authenticate("local",{failureRedirect: "/user/login",failureFlash:true}),(req,res)=>{
    
    req.flash("success","Login Successfully Completed!!!");
    if(res.locals.redirectUrl){
        return res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listings");
    }
    
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Succesfully Logged Out!!!");
        res.redirect("/listings");
    })
})
module.exports=router;