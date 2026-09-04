const mongoose=require("mongoose");
const historySchema=mongoose.Schema({
    brand:{
        type:String,
        required:true,
    },
    bookingTime:{
        type:Date,
        required:true,
    },
    returnTime:{
        type:Date,
        required:true,
    },
    mobileNumber:{
        type:Number,
    }
})
const History=new mongoose.model("History",historySchema);
module.exports=History;