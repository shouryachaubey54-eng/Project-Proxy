const mongoose=require("mongoose");
const Review=require("./review.js");
const History=require("./History.js");
let schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1730072787459-7d5f55be3422?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=> v===""?"https://images.unsplash.com/photo-1730072787459-7d5f55be3422?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :v,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        default:"India"
    },
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"  
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    time:[{
        bookingTime:{
        type:Date,
        required:true,
        },
    returnTime:{
        type:Date,
        required:true,
    }
    }]
    ,
    category:{
        type:String,
        required:true,
    }
})
schema.post("findOneAndDelete",async (data)=>{
    if(data.review){
        await Review.deleteMany({_id:{$in:data.review}});
    }
})
const Model1=mongoose.model("Model1",schema);
module.exports =Model1;