const mongoose=require("mongoose");
const reviewSchema=mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5
    },
    comment:{
        type:String,
    },
    created_at:{
        type:Date,
        default:Date.now(),
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
let Review=mongoose.model("Review",reviewSchema);
module.exports=Review;