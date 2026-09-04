const express=require("express");
const router=express.Router({mergeParams:true});
let wrapAsync=require("../utilities/wrapAsync.js");
const {loginMiddleware}=require("../utilities/middleware.js");
const Model1=require("../models/model1.js");
let Review=require("../models/review.js");
let expressErr=require("../utilities/errorClass.js");
let {reviewSchema}=require("../reviewJoi.js");
const reviewValidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new expressErr(400,error);
    }else{
        next();
    }
}
//Saving of the Review.
router.post("/",loginMiddleware,reviewValidation,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let {review}=req.body;
    let listing=await Model1.findById(id);
    let review1=new Review(review);
    review1.owner=req.user._id;
    await review1.save();
    listing.review.push(review1);
    await listing.save();
    req.flash("success","New Review Added!!!");
    res.redirect(`/listings/${id}`);
}))
//deleteing Reviews 
router.delete("/:review_id",loginMiddleware,async (req,res)=>{
    let {id,review_id}=req.params;
    await Model1.findByIdAndUpdate(id,{$pull :{review:review_id}});     
    await Review.findByIdAndDelete(review_id);
    req.flash("success","review Deleted!!!");
    res.redirect(`/listings/${id}`);
})
module.exports=router;