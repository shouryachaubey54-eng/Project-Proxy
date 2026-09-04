const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
app.use(session({secret:"String",resave:false,saveUninitialized:true}));
app.use(flash());
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
let port=3000;
app.listen(port,()=>{
    console.log("Listening");
})

app.get("/new",(req,res)=>{
    let {name="Random"}=req.query;
    req.session.name=name;
    req.flash("key","New User Added");
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    let {name}=req.session;
    let message=req.flash("key");  
    res.render("./hello.ejs",{name,message});
})