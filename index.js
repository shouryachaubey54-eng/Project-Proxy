require("dotenv").config();
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express=require("express");
const app=express();
const methodoverride=require("method-override");
const path=require("path");
const session=require("express-session");
const Mongostore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
const mongoose=require("mongoose");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const ejsmate= require('ejs-mate');
app.engine("ejs",ejsmate);
let link=process.env.MONGO_URI;
let Secretword=process.env.Secretword;
main()
.then(()=>{
    console.log("Connection Successful");
})
async function main(){
    await mongoose.connect(link);
}
const store=Mongostore.create({
    mongoUrl:link,
    crypto:{
        secret:Secretword,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in session store",err);
})
app.use(methodoverride("_method"));
const sessionInfo={
    store,
    secret:Secretword,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionInfo));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.err=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})
const listing=require("./routes/listings.js");
const review=require("./routes/review.js");
const user=require("./routes/user.js");
app.use("/listings",listing);
app.use("/listings/:id/review",review);
app.use("/user",user);
let expressErr=require("./utilities/errorClass.js");
const port=8080;
app.listen(port,()=>{
    console.log("Listening");
})
const Model1=require("./models/model1.js");
const { required } = require("joi");
app.use((req,res,next)=>{
    next(new expressErr(403,"Page Not Found!!!"));
})
app.use((err,req,res,next)=>{
    let {status=401,message="Some error Occured"}=err;
    res.status(status).render("listings/err.ejs",{message});
})
