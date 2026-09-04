const express=require("express");
const router=express.Router();
let wrapAsync=require("../utilities/wrapAsync.js");
let {listingSchema}=require("../schema.js");
const Model1=require("../models/model1.js");
const User=require("../models/user.js");
const History=require("../models/History.js");
const {loginMiddleware}=require("../utilities/middleware.js");
const {bookingMiddleware}=require("../utilities/middleware.js");
let expressErr=require("../utilities/errorClass.js");
const validateSchema=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new expressErr(400,error);
    }else{
        next();
    }
}
router.get("/",wrapAsync(async (req,res)=>{
    res.locals.message=req.flash("key");
    let lists=await Model1.find();
    res.render("listings/index.ejs",{lists});
}))
//form for new Listing
router.get("/new",loginMiddleware,(req,res)=>{
    res.render("listings/form.ejs");
})
//particular place info
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let info=await Model1.findById(id).populate("review").populate("owner");
    console.log(info);
    if(!info){
        req.flash("error","Page not exist!!!");
        return res.redirect("/listings");
    }
    res.render("listings/user.ejs",{info});
}))
//new user added
router.post("/new",validateSchema,wrapAsync(async (req,res,next)=>{
    const listing=req.body.listing;
    listing.owner=req.user._id;
    let user=new Model1(listing);
    await user.save();
    req.flash("success","New Data Registered!!!");
    res.redirect("/listings");
}));
//rendering edit page.
router.get("/:id/edit",loginMiddleware,wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    let info=await Model1.findById(id);
    if(!info){
        return next(new expressErr(400,"Invalid Data Enetred!!!"));
    }
    return res.render("listings/edit.ejs",{info});
}))
//Update Listing.
router.patch("/:id",loginMiddleware,validateSchema,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=req.body.listing;
    console.log(listing);
    await Model1.findByIdAndUpdate(id,{...listing});
    req.flash("success","Data Updated!!!");
    res.redirect(`/listings/${id}`);
}))
//user Deleted.
router.get("/:id/delete",loginMiddleware,wrapAsync(async (req,res,next)=>{
    
    let {id}=req.params;
    let info=await Model1.findByIdAndDelete(id);
    req.flash("success","Data Deleted!!!");
    res.redirect("/listings");
}))
//rendering particular option page
router.post("/search/options",async (req,res)=>{
    let option=req.body.bikes;
    if(option=="all"){
        return res.redirect("/listings");
    }
    let listings=await Model1.find({category:option});
    console.log(listings);
    return res.render("listings/options.ejs",{listings});
})
router.get("/booking/:id",bookingMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Model1.findById(id);
    const disabledRanges = [];
    for(times of listing.time){
        disabledRanges.push({
        from: new Date(times.bookingTime).toISOString(),
        to: new Date(times.returnTime).toISOString()
      });
    }
    console.log("first2");
    return res.render("listings/bookingForm.ejs", { 
      id, 
      disabledRanges
    });

  } catch (err) {
    next(err);
  }
});
router.post("/booking/:id",async (req,res)=>{
    let {id}=req.params;
    let listings=req.body.listings;
    let listing=await Model1.findById(id);
    listings.brand=listing.title;
    let history1=new History(listings);
    const bookingTime = new Date(listings.bookingTime);
    const returnTime = new Date(listings.returnTime);
    console.log("Second");
    console.log(new Date(listings.bookingTime));
    console.log("Second2");
    for (let list of listing.time) {
        if (bookingTime < list.returnTime && returnTime > list.bookingTime) {
        throw new expressErr(400, "Selected dates overlap with an existing booking");
        }
    }
    listing.time.push({bookingTime:bookingTime,returnTime:returnTime});
    await listing.save();
    await history1.save();
    let userId=req.user._id;
    let user=await User.findById(userId);
    user.history.push(history1);
    await user.save();
    req.flash("success","Bike Booked for You!!!");
    return res.redirect("/listings");
})
router.get("/history/user",async (req,res)=>{
    let user=req.user;
    let user1= await User.findById(user._id).populate("history");
    console.log(user1);
    return res.render("listings/history.ejs",{user1});
})

module.exports=router;